from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from .detection import Detector
from .coordinate import Coordinate
#reference: http://javabin.cn/2018/django_steam.html

#setting path for yolo configuration
yolo_config = '/home/Soen490/Soen490/project/backend/360_opencv/yolov3.cfg'
yolo_weights = '/home/Soen490/Soen490/project/backend/360_opencv/yolov3.weights'
yolo_classes = '/home/Soen490/Soen490/project/backend/360_opencv/coco.names'
video_stream = '/home/Soen490/Soen490/project/backend/backend_django/camera/hwt.mp4'

# initialize a detector object
detector = Detector(yolo_config,yolo_weights,yolo_classes,video_stream)
# Get the classes that can be detected and the detecting net 
classes, net = detector.load()
# sending streaming to frontend
def cam(request): 
    output=detector.gen(classes, net)
    return StreamingHttpResponse(output,content_type="multipart/x-mixed-replace;boundary=frame")

def send_json(request):
    j = detector.coord.dict.items()
    return HttpResponse(j,content_type="application/json")