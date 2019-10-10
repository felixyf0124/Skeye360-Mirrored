from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from .detection import Detector

#reference: http://javabin.cn/2018/django_steam.html

#setting path for yolo configuration
yolo_config = '/SOEN490/project/backend/360_OpenCV/yolov3-tiny.cfg'
yolo_weights = '/SOEN490/project/backend/360_OpenCV/yolov3-tiny.weights'
yolo_classes = '/SOEN490/project/backend/360_OpenCV/coco.names'
video_stream = '/SOEN490/project/backend/backend_django/camera/highway_cars.mp4'

# initialize a detector object
detector = Detector(yolo_config,yolo_weights,yolo_classes,video_stream)
# Get the classes that can be detected and the detecting net 
classes, net = detector.load()

# sending streaming to frontend
def cam(request): 
    output=detector.gen(classes, net)
    return StreamingHttpResponse(output,content_type="multipart/x-mixed-replace;boundary=frame")