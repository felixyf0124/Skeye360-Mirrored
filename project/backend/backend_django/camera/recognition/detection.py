import cv2 
import numpy as np
import time
import threading
from .counter import Counter
from .db import *
from .centroidtracker import CentroidTracker
from .trackableobject import TrackableObject
import dlib

#https://stackoverflow.com/questions/54426573/is-there-a-way-to-capture-video-from-a-usb-camera-with-multiple-processes-in-pyt
#http://emaraic.com/blog/yolov3-custom-object-detector
#https://www.pyimagesearch.com/2018/08/13/opencv-people-counter/



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
        
        # positions of the lines to calculate the directions on the frame
        east_line = 872
        west_line = 440
        north_line = 187
        south_line = 504
        
        inner_east_line = 872-70
        inner_west_line = 440+70
        inner_north_line = 187+70
        inner_south_line = 504-70
        
        # create ROIs
        pts_west = np.array([[572,244],[413,388],[108,316],[94,204]], np.int32)
        pts_south = np.array([[409,456],[737,512],[582,718],[0,718]], np.int32)
        pts_east = np.array([[921,275],[859,477],[1278,500],[1278,323]], np.int32)
        pts_north = np.array([[681,250],[840,255],[1028,0],[725,0]], np.int32)
        pts_mid = np.array([[415,435],[825,491],[892,284],[610,260]], np.int32)

        west_ROI = pts_west.reshape((-1,1,2))
        south_ROI = pts_south.reshape((-1,1,2))
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
            cv2.polylines(image,[south_ROI],True,(255), 2)
            cv2.polylines(image,[north_ROI],True,(255), 2)
            cv2.polylines(image,[mid_ROI],True,(255), 2)

            status = "Waiting"
            rects = []

            if totalFrames % skip_frames == 0:
                status = "Detecting"
                print(status)
                trackers = []
                # convert the frame to a blob and detect through the network
                blob = cv2.dnn.blobFromImage(image, 1.0/255.0, (416,416), [0,0,0], True, crop=False)
                net.setInput(blob)
                outs = net.forward(self.getOutputsNames(net))
            
                class_ids = []
                confidences = []
                boxes = []
                conf_threshold = 0.4
                nms_threshold = 0.3
                for out in outs: 
                    for detection in out:            
                    #each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                        scores = detection[5:]#classes scores starts from index 5
                        class_id = np.argmax(scores)
                        confidence = scores[class_id]
                        if confidence > 0.4:
                            center_x = int(detection[0] * Width)
                            center_y = int(detection[1] * Height)
                            w = int(detection[2] * Width)
                            h = int(detection[3] * Height)
                            x = center_x - w / 2
                            y = center_y - h / 2
                            class_ids.append(class_id)
                            confidences.append(float(confidence))
                            boxes.append([x, y, w, h])
                indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)
                for i in indices:
                    class_id = class_ids[i[0]]               
                    label = classes[class_id]
                    if label != "car":
                        print(label)
                        continue
                        
                    i = i[0]
                    box = boxes[i]
                    x = box[0]
                    y = box[1]
                    w = box[2]
                    self.draw_pred(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h),classes)
                    self.print_pred(class_ids[i], x, y, w, h, classes)
                    
                    # construct a dlib rectangle object from the bounding
                    # box coordinates and then start the dlib correlation tracker
                    tracker = dlib.correlation_tracker()
                    rect = dlib.rectangle(round(x), round(y), round(x+w), round(y+h))
                    tracker.start_track(rgb, rect)

                    # add the tracker to the list of trackers, use them skip frames
                    trackers.append(tracker)
                # apply non-maximum suppression algorithm on the bounding boxes
                t, _ = net.getPerfProfile()
                    
                # # increment the counter
                # count.inc(len(indices))

            else:  
                print(status)      
                # loop over the trackers
                for tracker in trackers:
                    # set the status of our system to be 'tracking' rather
                    # than 'waiting' or 'detecting'
                    status = "Tracking"
                    print(status)
                    # update the tracker and grab the updated position
                    tracker.update(rgb)
                    pos = tracker.get_position()

                    # unpack the position object
                    startX = int(pos.left())
                    startY = int(pos.top())
                    endX = int(pos.right())
                    endY = int(pos.bottom())

                    # add the bounding box coordinates to the rectangles list
                    rects.append((startX, startY, endX, endY))

            # use the centroid tracker to associate the (1) old object
            # centroids with (2) the newly computed object centroids
            objects = ct.update(rects)
            
            # loop over the tracked objects
            for (objectID, centroid) in objects.items():
                # check to see if a trackable object exists for the current
                # object ID
                to = trackableObjects.get(objectID, None)

                # if there is no existing trackable object, create one
                if to is None:
                    to = TrackableObject(objectID, centroid)
                else:
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
                            elif (cv2.pointPolygonTest(south_ROI, start_point, False)) >= 0:
                                to.start_from = "south"
                        
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
                        if to.crossing and (cv2.pointPolygonTest(south_ROI, start_point, False)) >= 0:
                            to.go_to = "south"
                            to.counted = True

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

                # store the trackable object in our dictionary
                trackableObjects[objectID] = to

                # draw both the ID of the object and the centroid of the
                # object on the output frame
                text = "ID {}".format(objectID)
                print(text+ ' start: '+str(to.centroids[0][0])+' , '+str(to.centroids[0][1])+ ' current: '+str(to.centroids[-1][0])+' , '+str(to.centroids[-1][1]))
                print(to.start_from)
                print(to.go_to)
                cv2.putText(image, text, (centroid[0] - 10, centroid[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(image, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)
            
            print(str(east_to_east) +','+ str(east_to_west) +','+ 
                str(east_to_north) +','+ str(east_to_south) +','+ 
                str(west_to_east) +','+ str(west_to_west) +','+ 
                str(west_to_north)  +','+ str(west_to_south)  +','+ 
                str(north_to_east) +','+ str(north_to_west) +','+ 
                str(north_to_north) +','+ str(north_to_south) +','+ 
                str(south_to_east) +','+ str(south_to_west) +','+ 
                str(south_to_north)  +','+ str(south_to_south))
            totalFrames += 1
            label = 'Inference time: %.2f ms' % (t * 1000.0 / cv2.getTickFrequency())
            cv2.putText(image, label, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            frame = self.frame_to_bytes(image)
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
        