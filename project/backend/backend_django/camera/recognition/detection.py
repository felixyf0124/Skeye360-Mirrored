import cv2 
import os
import numpy as np
import time
import threading
import sys
import logging
from .db import Db
from .intersection import Intersection
from .trackableobject import TrackableObject
from .coordinate import Coordinate
from collections import deque
from .deep_sort import preprocessing
from .deep_sort import nn_matching
from .deep_sort.detection import Detection
from .deep_sort.tracker import Tracker
from .tools import generate_detections as gdet
from .deep_sort.detection import Detection as ddet

# set up for logging
logger = logging.getLogger("camera")

#references:
#https://stackoverflow.com/questions/54426573/is-there-a-way-to-capture-video-from-a-usb-camera-with-multiple-processes-in-pyt
#http://emaraic.com/blog/yolov3-custom-object-detector
#https://www.pyimagesearch.com/2018/08/13/opencv-people-counter/
#https://github.com/yehengchen/Object-Detection-and-Tracking/blob/master/OneStage/yolo/deep_sort_yolov3/main.py


class Detector:
    def __init__(self, config, weights, class_names,video_stream):
        self.config = config
        self.weights = weights
        self.class_names = class_names
        self.stream = video_stream
        self.coord = Coordinate()
        self.start_counting = False
        logger.info("Detector is created")

    # Load names classes
    def load(self):
        classes = None
        with open(self.class_names, 'r') as f:
            classes = [line.strip() for line in f.readlines()]
        # Define network from configuration file and load the weights from the given weights file
        net = cv2.dnn.readNet(self.weights,self.config)
        logger.info("Loading deep learning net")        
        return classes, net

    # Get names of output layers, output for YOLOv3 is ['yolo_16', 'yolo_23']
    def get_outputs_names(self, net):
        layersNames = net.getLayerNames()
        return [layersNames[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    # Darw a rectangle surrounding the object and its class name 
    def draw_pred(self, img, class_id, confidence, x, y, x_plus_w, y_plus_h, classes):
        #Generate color for each class randomly
        COLORS = np.random.uniform(0, 255, size=(len(classes), 3))        
        label = str(classes[class_id])
        color = COLORS[class_id]
        cv2.rectangle(img, (x,y), (x_plus_w,y_plus_h), color, 2)
        cv2.putText(img, label, (x-10,y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # print detection output 
    def print_pred(self, class_id, x, y, w, h, classes):
        label = str(classes[class_id])
        print(label, round(x+w/2), round(y+h/2))

    # count detection output at the same time detecting objects in the frame
    def counting(self,col,intersection):        
        WAIT_SECONDS = 20        
        if self.start_counting is True:
            db = Db()
            db.insert_count(col,intersection.counters)
            # cleanup db
            intersection.reset_counter()
            db.find_all_count(col)            
    # Open a video
    def open_video(self):
        cap = cv2.VideoCapture(self.stream)
        logger.info("Opening video stream")  
        return cap

    # Convert from frame to bytes
    def frame_to_bytes(self,image):
        ret,jpeg = cv2.imencode('.jpg',image)
        return jpeg.tobytes()
    
    # Create an intersection
    def create_intersection(self, name):
        intersection = Intersection(name)
        directions = ["east","west","north","south"]
        for d1 in directions:
            for d2 in directions:
                intersection.add_counter(d1,d2)
        return intersection

    # create regions of interst
    def create_ROIs(self):
        # pts_west = np.array([[533,191],[679,601],[1,639],[1,125]], np.int32)
        pts_north = np.array([[0,230],[640,230],[640,0],[0,0]], np.int32)
        # pts_east = np.array([[1119,321],[1223,487],[1279,475],[1279,298]], np.int32)
        pts_south = np.array([[0,260],[640,260],[640,450],[0,450]], np.int32)
        pts_mid = np.array([[0,230],[640,230],[640,260],[0,260]], np.int32)

        # west_ROI = pts_west.reshape((-1,1,2))
        south_ROI = pts_south.reshape((-1,1,2))
        # east_ROI = pts_east.reshape((-1,1,2))
        north_ROI = pts_north.reshape((-1,1,2))
        mid_ROI = pts_mid.reshape((-1,1,2))
        logger.info("Creating ROIs")  
        return [mid_ROI, {"south":south_ROI, "north":north_ROI}]

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
    def draw_ROIs(self,image, ROI_list):
        for r in ROI_list[1].values():
            cv2.polylines(image,[r],True,(255), 2)
        cv2.polylines(image,[ROI_list[0]],True,(255), 2)
        logger.info("Drawing ROIs")  
    # create a deepsort tracker with deep_sort Definition of the parameters

    def create_tracker(self):
        max_cosine_distance = 0.5#0.9 
        nn_budget = None     
        metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
        tracker = Tracker(metric)
        logger.info("Creating deepsort tracker")  
        return tracker

    def create_encoder(self):
        model_filename = os.path.abspath(os.path.join(os.getcwd(),".."))+'/camera/recognition/model_data/market1501.pb'
        return gdet.create_box_encoder(model_filename,batch_size=1)
        
    # Generate StreamingHttpResponse
    def gen(self, classes, net):
		
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
             
        # deep_sort Definition of the parameters
        nms_max_overlap = 0.3 

        encoder = self.create_encoder()
        tracker = self.create_tracker()
        tracking_dict = {}
        coord_dict = Coordinate()
		
		# now we start to read video frame by frame to detect and tracking the vehicles appear on the frames
        while True:
            hasframe, image = cap.read()
            if not hasframe:
                logger.error("Video importing error")
                return -1                
            # image=cv2.resize(image, (620, 480))

            #get the size of the image
            Width = image.shape[1]
            Height = image.shape[0]                
            
            # convert the frame to a blob and detect through the network
            blob = cv2.dnn.blobFromImage(image, 1.0/255.0, (416,416), [0,0,0], True, crop=False)
            net.setInput(blob)
            outs = net.forward(self.get_outputs_names(net))
            
			# setting the data structures needed to keep the result of detection
            class_ids = []
            confidences = []
            boxes = []
            yolo_boxes = []
			
			# set the threshold for success detection 
            conf_threshold = 0.6
            nms_threshold = 0.5
			
			# potential detection out of deep learning network
            for out in outs: 
                for detection in out:            
                #each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                    scores = detection[5:]#classes scores starts from index 5
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.6:
                        center_x = int(detection[0] * Width)
                        center_y = int(detection[1] * Height)
                        w = int(detection[2] * Width)
                        h = int(detection[3] * Height)
                        x = center_x - w / 2
                        y = center_y - h / 2
                        class_ids.append(class_id)
                        confidences.append(float(confidence))
                        boxes.append([x, y, w, h])
            yolo_indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)
			
			# we only care about the vehicles for now
            for i in yolo_indices:
                class_id = class_ids[i[0]]               
                label = classes[class_id]
                if label not in ["car","bus","truck"]:
                    continue
                i = i[0]
                box = boxes[i]
                yolo_boxes.append(box)
                x = box[0]
                y = box[1]
                w = box[2]
                h = box[3]
				
				#output object detected on the frame
                self.draw_pred(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h), classes)
                self.print_pred(class_ids[i], x, y, w, h, classes)
			
			# ready to use DeepSort algorithm to track the vehicles that are detected
            # apply non-maximum suppression algorithm on the bounding boxes
            t, _ = net.getPerfProfile()

            features = encoder(image,yolo_boxes)

            # score to 1.0 here.
            detections = [Detection(bbox, 1.0, feature) for bbox, feature in zip(yolo_boxes, features)]
            
            # Run non-maxima suppression.
            detection_boxes = np.array([d.tlwh for d in detections])
            scores = np.array([d.confidence for d in detections])
            indices = preprocessing.non_max_suppression(detection_boxes, nms_max_overlap, scores)
            detections = [detections[i] for i in indices]

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
                    coord_dict.dict[track.track_id] = centroid
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
			# object on the output frame
            for x in tracking_dict.values():
                print("ID {}".format(x.objectID)+ ' start: ', end="")
                print(str(x.centroids[0][0])+' , '+str(x.centroids[0][1])+ ' current: '+str(x.centroids[-1][0])+' , '+str(x.centroids[-1][1]))
                # print("ID {}".format(track.track_id)+ ' start: '+str(to.centroids[0][0])+' , '+str(to.centroids[0][1])+ ' current: '+str(to.centroids[-1][0])+' , '+str(to.centroids[-1][1]))
                print(x.start_from)
                print(x.go_to)
            
            # save the coordinates for the tracked vehicles and get ready for front end to retrieve them
            self.coord= coord_dict
            
            totalFrames += 1
            self.start_counting = True
            self.draw_ROIs(image, ROI_list)
            label = 'Inference time: %.2f ms' % (t * 1000.0 / cv2.getTickFrequency())
            cv2.putText(image, label, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            frame = self.frame_to_bytes(image)
			
			# yield the bytes of frame, and get ready for front end to retrieve them
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
        
