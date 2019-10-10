import cv2 
import numpy as np
import time
import threading
from .counter import Counter

#https://stackoverflow.com/questions/54426573/is-there-a-way-to-capture-video-from-a-usb-camera-with-multiple-processes-in-pyt
#http://emaraic.com/blog/yolov3-custom-object-detector

yolo_config = '/SOEN490/project/backend/360_OpenCV/yolov3_tiny.cfg'
yolo_weights = '/SOEN490/project/backend/360_OpenCV/yolov3_tiny.weights'
yolo_classes = '/SOEN490/project/backend/360_OpenCV/coco.names'
video_stream = '/SOEN490/project/backend/backend_django/camera/highway_cars.mp4'

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
    def counting(self,count):
        WAIT_SECONDS = 5
        print(time.ctime())
        count.print_counter()
        count.reset_counter()
        threading.Timer(WAIT_SECONDS, self.counting,[count]).start()

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
        # initialize a counter and start counting the objects to be detected
        count = Counter()
        self.counting(count)
        cap = self.open_video()        

        while True:
            hasframe, image = cap.read()
            # image=cv2.resize(image, (620, 480)) 
            
            blob = cv2.dnn.blobFromImage(image, 1.0/255.0, (416,416), [0,0,0], True, crop=False)
            Width = image.shape[1]
            Height = image.shape[0]
            net.setInput(blob)
            
            outs = net.forward(self.getOutputsNames(net))
            
            class_ids = []
            confidences = []
            boxes = []
            conf_threshold = 0.5
            nms_threshold = 0.4
            for out in outs: 
                for detection in out:            
                #each detection  has the form like this [center_x center_y width height obj_score class_1_score class_2_score ..]
                    scores = detection[5:]#classes scores starts from index 5
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5:
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
                i = i[0]
                box = boxes[i]
                x = box[0]
                y = box[1]
                w = box[2]
                h = box[3]
                #print(str(classes[class_id]),round(x+w/2), round(y+h/2))            
                # print(round(x))
                # print(round(y))
                # print(round(x+w))
                # print(round(y+h))		
                self.draw_pred(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h),classes)
                self.print_pred(class_ids[i], x, y, w, h, classes)
            # increment the counter
            count.inc(len(indices))
            
            # apply  non-maximum suppression algorithm on the bounding boxes
            t, _ = net.getPerfProfile()
            label = 'Inference time: %.2f ms' % (t * 1000.0 / cv2.getTickFrequency())
            cv2.putText(image, label, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0))
            frame = self.frame_to_bytes(image)
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
        