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


logging.disable(logging.INFO)
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
        self.level_of_service = 0
        # sum of crossing time and number of crossed vehicle, will be reset every 100 seconds
        self.crossing_time = 0 
        self.crossed_number = 0.001 # avoid devide by zero error
        self.night_mode = True
        self.light_signals = {'east-west': 0 , 'north-south': 0}
        logger.info("Detector is created")
        
    # Get names of output layers, output for YOLOv3 is ['yolo_16', 'yolo_23']
    def get_outputs_names(self, net):
        layersNames = net.getLayerNames()
        return [layersNames[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    # Darw a rectangle surrounding the object and its class name 
    def draw_pred(self, img, class_name, x, y, x_plus_w, y_plus_h):
        label = str(class_name)
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

    # get average level of service 
    def save_level_of_service_then_reset(self):
        self.level_of_service = self.crossing_time/self.crossed_number
        print("LOS: " + str(self.level_of_service))
        print("reset!")
        WAIT_SECONDS = 100
        self.crossed_number = 0.0001 # avoid devide by zero error
        self.crossing_time = 0
        threading.Timer(WAIT_SECONDS, self.save_level_of_service_then_reset,[]).start()
        

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
    # Draw ROIs
    def draw_ROIs(self, image, ROI_list):
        for r in ROI_list[1].values():
            cv2.polylines(image, [r], True, (255), 2)
        cv2.polylines(image, [ROI_list[0]], True, (255), 2)
        logger.info("Drawing ROIs")

    # regions where pedestrians are waiting
    def create_pedestrian_ROIs(self):        
        pts_1 = np.array([[571,149],[564,161],[578,162],[584,150]], np.int32)
        pts_2 = np.array([[659,186],[655,204],[697,207],[700,190]], np.int32)
        pts_4 = np.array([[636,319],[631,337],[692,343],[692,325]], np.int32)
        pts_5 = np.array([[460,384],[427,432],[449,440],[483,392]], np.int32)
        pts_7 = np.array([[205,329],[160,360],[178,373],[221,338]], np.int32)
        pts_8 = np.array([[193,239],[230,246],[216,255],[181,246]], np.int32)
        pts_10 = np.array([[322,166],[354,171],[363,163],[333,160]], np.int32)
        pts_11 = np.array([[473,144],[465,152],[475,155],[488,143]], np.int32)

        ROI_1 = pts_1.reshape((-1,1,2))
        ROI_2 = pts_2.reshape((-1,1,2))
        ROI_4 = pts_4.reshape((-1,1,2))
        ROI_5 = pts_5.reshape((-1,1,2))
        ROI_7 = pts_7.reshape((-1,1,2))
        ROI_8 = pts_8.reshape((-1,1,2))
        ROI_10 = pts_10.reshape((-1,1,2))
        ROI_11 = pts_11.reshape((-1,1,2))
        logger.info("Creating ROIs")
        return {"ROI_1": ROI_1,"ROI_2":ROI_2,"ROI_4":ROI_4,"ROI_5":ROI_5,"ROI_7":ROI_7,"ROI_8":ROI_8,"ROI_10":ROI_10,"ROI_11":ROI_11}

    # Draw Pedestrian ROIs
    def draw_pedestrian_ROIs(self, image, ROI_dict):
        for key in ROI_dict:
            cv2.polylines(image, [ROI_dict[key]], True, (255), 2)
        logger.info("Drawing pedestrian ROIs")

    # Find where the car is coming from and add the origin to the trackable object
    def get_origin(self,start_point, trackableObject, ROI_list):        
        for r in ROI_list[1].items():
            if (cv2.pointPolygonTest(r[1], start_point, False)) >= 0:
                trackableObject.start_from = r[0]
                trackableObject.time_0 = time.time()
                break

    # Find if there is any pedestrian waiting to cross        
    def pedestrian_waiting(self,pedestrian_coord_list,ROI_dict):
        for key in ROI_dict:
            for coord in pedestrian_coord_list:
                if (cv2.pointPolygonTest(ROI_dict[key], coord, False)) >= 0:
                    return key 
        return None

    # Find where the car is going to and add the destination to the trackable object
    def get_destination(self,current, trackableObject, ROI_list):
        for r in ROI_list[1].items():
            if (cv2.pointPolygonTest(ROI_list[0], current, False)) >= 0:
                trackableObject.crossing = True

            if trackableObject.crossing and (cv2.pointPolygonTest(r[1], current, False)) >= 0:
                trackableObject.go_to = r[0]
                trackableObject.counted = True
                trackableObject.time_1 = time.time()
                break
   
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

    # Find where the pedestrian is and add the origin to the trackable object
    def get_pedestrian_area(self,centroid, trackableObject, ROI_dict):
        trackableObject.time_0 = time.time()    
        for key in ROI_dict:
            if (cv2.pointPolygonTest(ROI_dict[key], centroid, False)) >= 0:
                trackableObject.start_from = key
                break

    # Generate StreamingHttpResponse
    def gen(self):
        intersection = self.create_intersection("main@broadway")
        # connect db
        database = Db()
        col = database.connection()

        self.save_level_of_service_then_reset()

        # start counting the objects to be detected
        self.counting(col,intersection)
        
        cap = self.open_video()        

        # initialize the total number of frames by far
        totalFrames = 0

        # create ROIs
        ROI_list = self.create_ROIs()

        # create pedestrian ROIs
        pedestrian_ROI_dict = self.create_pedestrian_ROIs()

        # set up darknet parameters
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

        p_tracker = self.create_tracker()
        p_tracking_dict = {}

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
            p_confidences = []
            p_yolo_boxes = []
            coord_dict = Coordinate()
            
            # potential detection out of deep learning network 
            for out in outs:
            # each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                class_name = str(out[0])[2:-1]
                confidence = out[1]
                if confidence > 0.6:
                    w = (float (out[2][2]))/415*852
                    h = (float (out[2][3]))/415*478
                    x = (float (out[2][0]))/415*852-0.5*w
                    y = (float (out[2][1]))/415*478-0.5*h
                    
                    if class_name in ["car","bus","truck"]:
                        class_names.append(class_name)
                        confidences.append(float(confidence))
                        yolo_boxes.append([x, y, w, h])
                        # output vehicle detected on the frame
                        self.draw_pred(image, class_name, round(x), round(y), round(x+w), round(y+h))
                    elif self.night_mode:
                        pedestrian_coord = [(round(x), round(y)),(round(x+w), round(y)),(round(x), round(y+h)),(round(x+w), round(y+h))]
                        ROI_key = self.pedestrian_waiting(pedestrian_coord,pedestrian_ROI_dict)
                        # self.inc_pedestria_counters(ROI_key,pedestrian_waiting_counters)
                        # output pedestrian detected on the frame
                        if ROI_key:
                            self.draw_pred(image, "pedestrian", round(x), round(y), round(x+w), round(y+h))
                            p_confidences.append(float(confidence))
                            p_yolo_boxes.append([x, y, w, h])
			
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
                        if((x.time_1 is not None) and (x.time_0 is not None)):
                            self.crossed_number = self.crossed_number + 1
                            self.crossing_time = self.crossing_time + (x.time_1 - x.time_0)

            # save the coordinates for the tracked vehicles and get ready for front end to retrieve them
            self.save_coordinate(coord_dict)

            if self.night_mode:
                # Run non-maxima suppression.
                p_detection_boxes = np.array(p_yolo_boxes)
                p_scores = np.array(p_confidences)
                p_indices = preprocessing.non_max_suppression(p_detection_boxes, nms_max_overlap, p_scores)
                p_detections = []
                for i in p_indices:
                    p_detection = Detection(p_detection_boxes[i],p_confidences[i],[])
                    p_detections.append(p_detection)

                # Call the tracker for pedestrian
                p_tracker.predict()
                p_tracker.update(p_detections)

                for track in p_tracker.tracks:
                    if not track.is_confirmed() or track.time_since_update > 1:
                        continue
                    bbox = track.to_tlbr()
                    cv2.rectangle(image, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])),(255,255,255), 2)
                    cv2.putText(image, str(track.track_id),(int(bbox[0]), int(bbox[1])),0, 5e-3 * 200, (0,255,0),2)
                    centroid = (int((bbox[0]+ bbox[2]) / 2.0), int((bbox[1] + bbox[3]) / 2.0))
                    ROI_key = self.pedestrian_waiting(pedestrian_coord,pedestrian_ROI_dict)

                    if track.track_id not in p_tracking_dict:
                        trackable_pedestrian = TrackableObject(track.track_id)
                        trackable_pedestrian.add_centroid(centroid)
                        p_tracking_dict[track.track_id] = trackable_pedestrian
                        self.get_pedestrian_area(centroid, trackable_pedestrian, pedestrian_ROI_dict)
                        trackable_pedestrian.time_1 = time.time()
                    else:                        
                        p_tracking_dict[track.track_id].time_1 = time.time()
                        
                    if p_tracking_dict[track.track_id].time_1 - p_tracking_dict[track.track_id].time_0 > 10:
                        waiting_area = p_tracking_dict[track.track_id].start_from
                        if waiting_area in ["ROI_11","ROI_1","ROI_5","ROI_7"] and self.light_signals['east-west'] == 0:
                            self.light_signals['east-west'] = time.time()
                            print('east-west' + str(self.light_signals['east-west']))
                        elif waiting_area in ["ROI_10","ROI_2","ROI_4","ROI_8"] and self.light_signals['north-south'] == 0:
                            self.light_signals['north-south'] = time.time()
                            print('north-south' + str(self.light_signals['north-south']))

                    current_time = time.time()
                    if current_time - self.light_signals['east-west'] > 8:
                        self.light_signals['east-west'] = 0
                    if current_time - self.light_signals['north-south'] > 8:
                        self.light_signals['north-south'] = 0

            fps = "FPS: " + str(int (1/(time.time()-prev_time)))
            cv2.putText(image, fps, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            self.start_counting = True
            self.draw_ROIs(image, ROI_list)
            self.draw_pedestrian_ROIs(image,pedestrian_ROI_dict)
            frame = self.frame_to_bytes(image)

            # intersection.print_counters()
            print(self.light_signals)
            print(len(tracking_dict))
            print(len(p_tracking_dict))
            self.frame = (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            
        
