from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.http import StreamingHttpResponse
from .detection import Detector
from .coordinate import Coordinate
import os
import logging
import threading
import queue

logger = logging.getLogger("camera")
#reference: http://javabin.cn/2018/django_steam.html

#setting path for yolo configuration
yolo_config = '../darknet/cfg/yolov3.cfg'
yolo_weights = '../darknet/yolov3.weights'
yolo_classes = '../darknet/data/coco.names'
yolo_meta = "../darknet/cfg/coco.data"
video_stream = './20191117_1600.mp4'

# initialize a detector object
detector = Detector(yolo_config,yolo_weights,yolo_classes,yolo_meta,video_stream)

# sending streaming to frontend
def cam_gen(detector):
    logger.info("Camera is running now")    
    detector.gen()

threading.Thread(target=cam_gen, args=(detector,)).start()

def cam(request):
    logger.info("Getting frames now")
    output = detector.yield_frame()
    return StreamingHttpResponse(output,content_type="multipart/x-mixed-replace;boundary=frame")

def send_json(request):
    logger.info("sending coordinates")
    j = detector.coord.dict.items()
    return HttpResponse(j,content_type="application/json")

def get_level_of_service(request):
    logger.info("get_level_of_service")
    los = detector.level_of_service
    data = {
        'los': los
    }
    return JsonResponse(data)
