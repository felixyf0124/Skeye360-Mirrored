from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from recognition.detection import Detector
from recognition.coordinate import Coordinate
import os
import logging

logger = logging.getLogger("camera")
#reference: http://javabin.cn/2018/django_steam.html

#setting path for yolo configuration
yolo_config = '../darknet/cfg/yolov3.cfg'
yolo_weights = '../darknet/yolov3.weights'
yolo_classes = '../darknet/data/coco.names'
yolo_meta = "../darknet/cfg/coco.data"
video_stream = '20191117_1600.mp4'

# initialize a detector object
detector = Detector(yolo_config,yolo_weights,yolo_classes,yolo_meta,video_stream)
# sending streaming to frontend
logger.info("Camera is running now")
detector.gen()
print("done")
