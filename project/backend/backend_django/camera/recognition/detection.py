import cv2 
import numpy as np
import time
import threading
from .counter import Counter
from .db import *
from .centroidtracker import CentroidTracker
from .trackableobject import TrackableObject
import dlib
from collections import deque
from .deep_sort import preprocessing
from .deep_sort import nn_matching
from .deep_sort.detection import Detection
from .deep_sort.tracker import Tracker
from .tools import generate_detections as gdet
from .deep_sort.detection import Detection as ddet

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

    # Load names classes
    def load(self):
        classes = None
        with open(self.class_names, 'r') as f:
            classes = [line.strip() for line in f.readlines()]
        print(classes)
        # Define network from configuration file and load the weights from the given weights file
        net = cv2.dnn.readNet(self.weights,self.config)
        return classes, net

    # Get names of output layers, output for YOLOv3 is ['yolo_16', 'yolo_23']
    def getOutputsNames(self, net):
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
    def counting(self,col,count):
        WAIT_SECONDS = 5
        print(time.ctime())
        insert_count(col,count)
        find_all_count(col)
        count.print_counter()
        count.reset_counter()
        threading.Timer(WAIT_SECONDS, self.counting,[col,count]).start()

    # Open a video
    def open_video(self):
        cap = cv2.VideoCapture(self.stream)
        return cap

    # Convert from frame to bytes
    def frame_to_bytes(self,image):
        ret,jpeg = cv2.imencode('.jpg',image)
        return jpeg.tobytes()
        
    # Generate StreamingHttpResponse
    def gen(self, classes, net):
        # # initialize a counter 
        # count = Counter()
        # # connect db
        # col = connection()
        # # cleanup db
        # drop_count(col)
        # # start counting the objects to be detected
        # self.counting(col,count)
        cap = self.open_video()        

        # set the centroid tracker and initialize a list to store the trackers
        # map each unique object ID to a TrackableObject
        ct = CentroidTracker(maxDisappeared=40, maxDistance=50)
        trackers = []
        trackableObjects = {}

        # initialize the total number of frames by far & the # of frames to skip
        totalFrames = 0
        skip_frames = 2
                
        # create ROIs
        # pts_west = np.array([[572,244],[413,388],[108,316],[94,204]], np.int32)
        # pts_south = np.array([[409,456],[737,512],[582,718],[0,718]], np.int32)
        # pts_east = np.array([[921,275],[859,477],[1278,500],[1278,323]], np.int32)
        # pts_north = np.array([[681,250],[840,255],[1028,0],[725,0]], np.int32)
        # pts_mid = np.array([[415,435],[825,491],[892,284],[610,260]], np.int32)

        pts_west = np.array([[533,191],[679,601],[1,639],[1,125]], np.int32)
        # pts_south = np.array([[409,456],[737,512],[582,718],[0,718]], np.int32)
        pts_east = np.array([[1119,321],[1223,487],[1279,475],[1279,298]], np.int32)
        pts_north = np.array([[701,153],[1003,217],[1000,1],[629,1]], np.int32)
        pts_mid = np.array([[677,215],[797,581],[1149,515],[1057,301]], np.int32)

        west_ROI = pts_west.reshape((-1,1,2))
        # south_ROI = pts_south.reshape((-1,1,2))
        east_ROI = pts_east.reshape((-1,1,2))
        north_ROI = pts_north.reshape((-1,1,2))
        mid_ROI = pts_mid.reshape((-1,1,2))

        #directions
        east_to_east = 0
        east_to_west = 0
        east_to_north = 0
        east_to_south = 0

        west_to_east = 0
        west_to_west = 0
        west_to_north = 0
        west_to_south = 0

        north_to_east = 0
        north_to_west = 0
        north_to_north = 0
        north_to_south = 0

        south_to_east = 0
        south_to_west = 0
        south_to_north = 0
        south_to_south = 0

        # deep_sort Definition of the parameters
        max_cosine_distance = 0.5#0.9 
        nn_budget = None
        nms_max_overlap = 0.3 
        model_filename = '/SOEN490/project/backend/backend_django/camera/recognition/model_data/market1501.pb'
        encoder = gdet.create_box_encoder(model_filename,batch_size=1)
        metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
        tracker = Tracker(metric)

        while True:
            hasframe, image = cap.read()
            # image=cv2.resize(image, (620, 480))

            #get the size of the image
            Width = image.shape[1]
            Height = image.shape[0]
            
	        # convert the frame from BGR to RGB for dlib
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            #draw ROIs
            cv2.polylines(image,[west_ROI],True,(255), 2)
            cv2.polylines(image,[east_ROI],True,(255), 2)
            # cv2.polylines(image,[south_ROI],True,(255), 2)
            cv2.polylines(image,[north_ROI],True,(255), 2)
            cv2.polylines(image,[mid_ROI],True,(255), 2)
            
            # convert the frame to a blob and detect through the network
            blob = cv2.dnn.blobFromImage(image, 1.0/255.0, (416,416), [0,0,0], True, crop=False)
            net.setInput(blob)
            outs = net.forward(self.getOutputsNames(net))
            
            class_ids = []
            confidences = []
            boxes = []
            yolo_boxes = []
            conf_threshold = 0.7
            nms_threshold = 0.6
            for out in outs: 
                for detection in out:            
                #each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                    scores = detection[5:]#classes scores starts from index 5
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.7:
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
            for i in yolo_indices:
                class_id = class_ids[i[0]]               
                label = classes[class_id]
                print(label)
                if label not in ["car","bus","truck","train"]:
                    continue
                    
                i = i[0]
                box = boxes[i]
                yolo_boxes.append(box)
                x = box[0]
                y = box[1]
                w = box[2]
                self.draw_pred(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h),classes)
                self.print_pred(class_ids[i], x, y, w, h, classes)

            # # increment the counter
            # count.inc(len(yolo_indices))

            # apply non-maximum suppression algorithm on the bounding boxes
            t, _ = net.getPerfProfile()

            features = encoder(image,yolo_boxes)

            # score to 1.0 here).
            detections = [Detection(bbox, 1.0, feature) for bbox, feature in zip(yolo_boxes, features)]
            
            # Run non-maxima suppression.
            detection_boxes = np.array([d.tlwh for d in detections])
            scores = np.array([d.confidence for d in detections])
            indices = preprocessing.non_max_suppression(detection_boxes, nms_max_overlap, scores)
            detections = [detections[i] for i in indices]

            # Call the tracker
            tracker.predict()
            tracker.update(detections)

            for track in tracker.tracks:
                if not track.is_confirmed() or track.time_since_update > 1:
                    continue 
                bbox = track.to_tlbr()
                cv2.rectangle(image, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])),(255,255,255), 2)
                cv2.putText(image, str(track.track_id),(int(bbox[0]), int(bbox[1])),0, 5e-3 * 200, (0,255,0),2)
                centroid = [int((bbox[0]+ bbox[1]) / 2.0), int((bbox[2] + bbox[3]) / 2.0)]
                to = TrackableObject(track.track_id, centroid)
                to.centroids.append(centroid)
                if not to.counted:
                    if to.start_from == "":
                        start_point = (to.centroids[0][0], to.centroids[0][1])
                        start_from = ""
                        go_to = ""
                        
                        if (cv2.pointPolygonTest(east_ROI, start_point, False)) >= 0:
                            to.start_from = "east"
                        elif (cv2.pointPolygonTest(west_ROI, start_point, False)) >= 0:
                            to.start_from = "west"
                        elif (cv2.pointPolygonTest(north_ROI, start_point, False)) >= 0:
                            to.start_from = "north"
                        # elif (cv2.pointPolygonTest(south_ROI, start_point, False)) >= 0:
                        #     to.start_from = "south"
                    
                    current = (centroid[0], centroid[1])
                    to.centroids.append(centroid)

                    if (cv2.pointPolygonTest(mid_ROI, start_point, False)) >= 0:
                        print("in the middle")
                        to.crossing = True

                    if to.crossing and (cv2.pointPolygonTest(east_ROI, start_point, False)) >= 0:
                        to.go_to = "east"
                        to.counted = True
                    if to.crossing and (cv2.pointPolygonTest(west_ROI, start_point, False)) >= 0:
                        to.go_to = "west"
                        to.counted = True
                    if to.crossing and (cv2.pointPolygonTest(north_ROI, start_point, False)) >= 0:
                        to.go_to = "north"
                        to.counted = True
                    # if to.crossing and (cv2.pointPolygonTest(south_ROI, start_point, False)) >= 0:
                    #     to.go_to = "south"
                    #     to.counted = True

                    if to.start_from == "east" and to.go_to == "east":
                        east_to_east+=1
                        to.counted = True
                    if to.start_from =="east" and to.go_to == "west":
                        east_to_west+=1
                        to.counted = True
                    if to.start_from == "east" and to.go_to == "north":
                        east_to_north+=1
                        to.counted = True
                    if to.start_from == "east" and to.go_to == "south":
                        east_to_south+=1
                        to.counted = True

                    if to.start_from == "west" and to.go_to == "east":
                        west_to_east+=1
                        to.counted = True
                    if to.start_from == "west" and to.go_to == "west":
                        west_to_west+=1
                        to.counted = True
                    if to.start_from == "west" and to.go_to == "north":
                        west_to_north+=1
                        to.counted = True
                    if to.start_from == "west" and to.go_to == "south":
                        west_to_south+=1
                        to.counted = True

                    if to.start_from == "north" and to.go_to == "east":
                        north_to_east+=1
                        to.counted = True
                    if to.start_from == "north" and to.go_to == "west":
                        north_to_west+=1
                        to.counted = True
                    if to.start_from == "north" and to.go_to == "north":
                        north_to_north+=1
                        to.counted = True
                    if to.start_from == "north" and to.go_to == "south":
                        north_to_south+=1
                        to.counted = True

                    if to.start_from == "south" and to.go_to == "east":
                        south_to_east+=1
                        to.counted = True
                    if to.start_from == "south" and to.go_to == "west":
                        south_to_west+=1
                        to.counted = True
                    if to.start_from == "south" and to.go_to == "north":
                        south_to_north+=1
                        to.counted = True
                    if to.start_from == "south" and to.go_to == "south":
                        south_to_south+=1
                        to.counted = True

                # # store the trackable object in our dictionary
                # trackableObjects[track.track_id] = to

                # draw both the ID of the object and the centroid of the
                # object on the output frame
                print("ID {}".format(track.track_id)+ ' start: '+str(to.centroids[0][0])+' , '+str(to.centroids[0][1])+ ' current: '+str(to.centroids[-1][0])+' , '+str(to.centroids[-1][1]))
                print(to.start_from)
                print(to.go_to)
            
            print("east_to_east: " + str(east_to_east))
            print("east_to_west: "+ str(east_to_west))
            print("east_to_north: "+ str(east_to_north))
            print("east_to_south: "+ str(east_to_south))
            print("west_to_east: "+ str(west_to_east))
            print("west_to_west: "+ str(west_to_west))
            print("west_to_north: "+ str(west_to_north))
            print("west_to_south: "+ str(west_to_south))
            print("north_to_east: "+ str(north_to_east))
            print("north_to_west: "+ str(north_to_west))
            print("north_to_north: "+ str(north_to_north))
            print("north_to_south: "+ str(north_to_south))
            print("south_to_east: "+ str(south_to_east))
            print("south_to_west: "+ str(south_to_west))
            print("south_to_north: "+ str(south_to_north))
            print("south_to_south: "+ str(south_to_south))

            totalFrames += 1
            label = 'Inference time: %.2f ms' % (t * 1000.0 / cv2.getTickFrequency())
            cv2.putText(image, label, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            frame = self.frame_to_bytes(image)
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
        