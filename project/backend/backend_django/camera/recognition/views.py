from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from .detection import Detector
from .coordinate import Coordinate
import os
import logging

logger = logging.getLogger("camera")
#reference: http://javabin.cn/2018/django_steam.html

#setting path for yolo configuration
yolo_config = os.path.abspath(os.path.join(os.getcwd(),"../.."))+'/360_opencv/yolov3.cfg'
yolo_weights = os.path.abspath(os.path.join(os.getcwd(),"../.."))+'/360_opencv/yolov3.weights'
yolo_classes = os.path.abspath(os.path.join(os.getcwd(),"../.."))+'/360_opencv/coco.names'
video_stream = os.path.abspath(os.path.join(os.getcwd(),".."))+'/camera/20191117_1600.mp4'

# initialize a detector object
detector = Detector(yolo_config,yolo_weights,yolo_classes,video_stream)
# Get the classes that can be detected and the detecting net 
classes, net = detector.load()
# sending streaming to frontend
def cam(request): 
    logger.info("Camera is running now")
    output=detector.gen(classes, net)
    return StreamingHttpResponse(output,content_type="multipart/x-mixed-replace;boundary=frame")

def send_json(request):
    logger.info("sending coordinates")
    j = detector.coord.dict.items()
    return HttpResponse(j,content_type="application/json")