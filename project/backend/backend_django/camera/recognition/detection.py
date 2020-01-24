import os
import numpy as np
import time
import threading
import sys
import logging
import cv2
sys.path.append("..")
from darknet import darknet 
sys.path.append("")
from .db import Db
from .intersection import Intersection
from .trackableobject import TrackableObject
from .coordinate import Coordinate
from collections import deque
from .deep_sort import preprocessing
from .deep_sort import nn_matching
from .deep_sort.detection import Detection
from .deep_sort.tracker import Tracker

# set up for logging
logger = logging.getLogger("camera")

#references:
#https://stackoverflow.com/questions/54426573/is-there-a-way-to-capture-video-from-a-usb-camera-with-multiple-processes-in-pyt
#http://emaraic.com/blog/yolov3-custom-object-detector
#https://www.pyimagesearch.com/2018/08/13/opencv-people-counter/
#https://github.com/yehengchen/Object-Detection-and-Tracking/blob/master/OneStage/yolo/deep_sort_yolov3/main.py


class Detector:
    def __init__(self, config, weights, class_names, meta, video_stream):
        self.config = config
        self.weights = weights
        self.class_names = class_names
        self.meta = meta
        self.stream = video_stream
        self.coord = Coordinate()
        self.start_counting = False
        self.frame = bytes("", 'utf-8')
        logger.info("Detector is created")

    # Load names classes
    # def load(self):
        # classes = None
        # with open(self.class_names, 'r') as f:
            # classes = [line.strip() for line in f.readlines()]
        # # Define network from configuration file and load the weights from the given weights file
        # net = cv2.dnn.readNet(self.weights,self.config)
        # logger.info("Loading deep learning net")        
        # return classes, net

    # Get names of output layers, output for YOLOv3 is ['yolo_16', 'yolo_23']
    def get_outputs_names(self, net):
        layersNames = net.getLayerNames()
        return [layersNames[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    # Darw a rectangle surrounding the object and its class name 
    def draw_pred(self, img, class_name, confidence, x, y, x_plus_w, y_plus_h):
        # #Generate color for each class randomly
        # COLORS = np.random.uniform(0, 255, size=(len(classes), 3))        
        label = str(class_name)
        # color = COLORS[class_id]
        cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), [0, 0, 255], 2)
        cv2.putText(img, label, (x-10, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, [0, 0, 255], 2)

    # print detection output 
    def print_pred(self, class_id, x, y, w, h, class_name):
        label = str(class_name)
        print(label, round(x+w/2), round(y+h/2))

    # count detection output at the same time detecting objects in the frame
    def counting(self,col,intersection):
        WAIT_SECONDS = 5
        print(self.start_counting)
        if self.start_counting is True:
            print(self.start_counting)
            db = Db()
            # cleanup db
            db.drop_count(col)
            db.insert_count(col,intersection.counters)
            # intersection.reset_counter()
            db.find_all_count(col)
        threading.Timer(WAIT_SECONDS, self.counting,[col,intersection]).start()
                               
    # Open a video
    def open_video(self):
        cap = cv2.VideoCapture(self.stream)
        logger.info("Opening video stream")  
        return cap

    # Convert from frame to bytes
    def frame_to_bytes(self, image):
        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()
    
    # Create an intersection
    def create_intersection(self, name):
        intersection = Intersection(name)
        directions = ["east", "west", "north", "south"]
        for d1 in directions:
            for d2 in directions:
                intersection.add_counter(d1,d2)
        return intersection

    # create regions of interst
    def create_ROIs(self):
        pts_west = np.array([[0,197],[263,247],[355,171],[0,99]], np.int32)
        pts_north = np.array([[474,155],[568,164],[666, 0],[507, 0]], np.int32)
        pts_east = np.array([[850,344],[850,208],[658,184],[568,326],[631,315]], np.int32)
        pts_south = np.array([[225,340],[431,403],[374,475],[0,475],[0,447]], np.int32)
        pts_mid = np.array([[236,297],[504,374],[628,184],[393,156]], np.int32)

        west_ROI = pts_west.reshape((-1,1,2))
        south_ROI = pts_south.reshape((-1, 1, 2))
        east_ROI = pts_east.reshape((-1,1,2))
        north_ROI = pts_north.reshape((-1, 1, 2))
        mid_ROI = pts_mid.reshape((-1, 1, 2))
        logger.info("Creating ROIs")
        return [mid_ROI, {"west":west_ROI, "south":south_ROI, "east":east_ROI, "north":north_ROI}]

    # Find where the car is coming from and add the origin to the trackable object
    def get_origin(self,start_point, trackableObject, ROI_list):        
        for r in ROI_list[1].items():
            if (cv2.pointPolygonTest(r[1], start_point, False)) >= 0:
                trackableObject.start_from = r[0]
                break
            

    # Find where the car is going to and add the destination to the trackable object
    def get_destination(self,current, trackableObject, ROI_list):
        for r in ROI_list[1].items():
            if (cv2.pointPolygonTest(ROI_list[0], current, False)) >= 0:
                trackableObject.crossing = True

            if trackableObject.crossing and (cv2.pointPolygonTest(r[1], current, False)) >= 0:
                trackableObject.go_to = r[0]
                trackableObject.counted = True
                break

    # Draw ROIs
    def draw_ROIs(self, image, ROI_list):
        for r in ROI_list[1].values():
            cv2.polylines(image, [r], True, (255), 2)
        cv2.polylines(image, [ROI_list[0]], True, (255), 2)
        # logger.info("Drawing ROIs")
    # create a deepsort tracker with deep_sort Definition of the parameters

    def create_tracker(self):
        max_cosine_distance = 0.5#0.9 
        nn_budget = None
        metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
        tracker = Tracker(metric)
        logger.info("Creating deepsort tracker")  
        return tracker
    # save the coordinates to the object for front en
    def save_coordinate(self, coord_dict):
        self.coord= coord_dict

    def yield_frame(self):
        while True:
            time.sleep(.03)
            yield self.frame

    # Generate StreamingHttpResponse
    def gen(self):
        intersection = self.create_intersection("main@broadway")
        # connect db
        database = Db()
        col = database.connection()

        # start counting the objects to be detected
        self.counting(col,intersection)
        
        cap = self.open_video()        

        # initialize the total number of frames by far
        totalFrames = 0

        # create ROIs
        ROI_list = self.create_ROIs()

        netMain = None
        metaMain = None
        altNames = None

        if netMain is None:
            netMain = darknet.load_net_custom(self.config.encode(
                "ascii"), self.weights.encode("ascii"), 0, 1)  # batch size = 1
        if metaMain is None:
            metaMain = darknet.load_meta(self.meta.encode("ascii"))
        if altNames is None:
            try:
                with open(self.meta) as metaFH:
                    metaContents = metaFH.read()
                    import re
                    match = re.search("names *= *(.*)$", metaContents,
                                      re.IGNORECASE | re.MULTILINE)
                    if match:
                        result = match.group(1)
                    else:
                        result = None
                    try:
                        if os.path.exists(result):
                            with open(result) as namesFH:
                                namesList = namesFH.read().strip().split("\n")
                                altNames = [x.strip() for x in namesList]
                    except TypeError:
                        pass
            except Exception:
                pass

        cap.set(3, 1280)
        cap.set(4, 720) 
        # Create an image we reuse for each detect
        darknet_image = darknet.make_image(darknet.network_width(netMain), darknet.network_height(netMain),3)	
        # deep_sort Definition of the parameters
        nms_max_overlap = 0.3 

        tracker = self.create_tracker()
        tracking_dict = {}
        
        # now we start to read video frame by frame to detect and tracking the vehicles appear on the frames
        while True:
            time.sleep(.03)
            prev_time = time.time()
            hasframe, image = cap.read()       
            if not hasframe:
                logger.error("Video importing error")
                return -1     
     
            totalFrames += 1
            if totalFrames%3!=1:
               continue
            # image=cv2.resize(image, (620, 480))

            #get the size of the image
              
            frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            frame_resized = cv2.resize(frame_rgb,
                                   (darknet.network_width(netMain),
                                    darknet.network_height(netMain)),
                                   interpolation=cv2.INTER_LINEAR)
            darknet.copy_image_from_bytes(darknet_image,frame_resized.tobytes())
            # convert the frame to a blob and detect through the network
            outs = darknet.detect_image(netMain, metaMain, darknet_image, thresh=0.25)
            # setting the data structures needed to keep the result of detection
            class_names = []
            confidences = []
            yolo_boxes = []
            coord_dict = Coordinate()
            # potential detection out of deep learning network 
            for out in outs:
            #each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                class_name = str(out[0])[2:-1]
                # we only care about the vehicles for now
                if class_name not in ["car","bus","truck"]:
                    continue
                confidence = out[1]
                if confidence > 0.6:
                    w = (float (out[2][2]))/415*852
                    h = (float (out[2][3]))/415*478

                    x = (float (out[2][0]))/415*852-0.5*w
                    y = (float (out[2][1]))/415*478-0.5*h
                    class_names.append(class_name)
                    confidences.append(float(confidence))
                    yolo_boxes.append([x, y, w, h])
                    
                # yolo_indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)
		
                #output object detected on the frame
                self.draw_pred(image, class_name, confidence, round(x), round(y), round(x+w), round(y+h))
                # self.print_pred(class_ids[i], x, y, w, h, classes)
			
            # Run non-maxima suppression.
            detection_boxes = np.array(yolo_boxes)
            scores = np.array(confidences)
            indices = preprocessing.non_max_suppression(detection_boxes, nms_max_overlap, scores)
            detections = []
            for i in indices:
                detection = Detection(detection_boxes[i],confidences[i],[])
                detections.append(detection)

            # Call the tracker
            tracker.predict()
            tracker.update(detections)
            	
			# potential tracking out of DeepSort algorithm
            for track in tracker.tracks:
                if not track.is_confirmed() or track.time_since_update > 1:
                    continue 
                bbox = track.to_tlbr()
                cv2.rectangle(image, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])),(255,255,255), 2)
                cv2.putText(image, str(track.track_id),(int(bbox[0]), int(bbox[1])),0, 5e-3 * 200, (0,255,0),2)
                centroid = [int((bbox[0]+ bbox[2]) / 2.0), int((bbox[1] + bbox[3]) / 2.0)]

                # for those eligible vehicles, we start to track them and put them in the tracking list
                if track.track_id not in tracking_dict:
                    to = TrackableObject(track.track_id)
                    to.add_centroid(centroid)
                    tracking_dict[track.track_id] = to
                    start_point = (centroid[0], centroid[1])
                    self.get_origin(start_point, to, ROI_list)
                else:
                    tracking_dict[track.track_id].add_centroid(centroid)
                    coord_dict.dict[track.track_id] = centroid
                for x in tracking_dict.values():
                    if not x.counted:
                        current = (x.centroids[-1][0], x.centroids[-1][1])
                        self.get_destination(current,x,ROI_list)
                        intersection.inc(x.start_from, x.go_to)

			# draw both the ID of the object and the centroid of the
			# object on the output frame  COMMENTED OUT, NEEDED FOR FUTURE REFACTORY
            # for x in tracking_dict.values():
            #     print("ID {}".format(x.objectID)+ ' start: ', end="")
            #     print(str(x.centroids[0][0])+' , '+str(x.centroids[0][1])+ ' current: '+str(x.centroids[-1][0])+' , '+str(x.centroids[-1][1]))
            #     print("ID {}".format(track.track_id)+ ' start: '+str(to.centroids[0][0])+' , '+str(to.centroids[0][1])+ ' current: '+str(to.centroids[-1][0])+' , '+str(to.centroids[-1][1]))
            #     print(x.start_from)
            #     print(x.go_to)
            
            # save the coordinates for the tracked vehicles and get ready for front end to retrieve them
            self.save_coordinate(coord_dict)

            fps = "FPS: " + str(int (1/(time.time()-prev_time)))
            cv2.putText(image, fps, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            self.start_counting = Trues
            self.draw_ROIs(image, ROI_list)
            frame = self.frame_to_bytes(image)
            intersection.print_counters()      

            # cv2.imshow("Display window", image)
            # cv2.waitKey(1)
            # yield the bytes of frame, and get ready for front end to retrieve them
            # yield (b'--frame\r\n'
            #    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            self.frame = (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            
        
