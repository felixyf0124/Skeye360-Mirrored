from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from .realtime import Realtime
import os
import logging
import threading
import queue

logger = logging.getLogger("camera")

# initialize a realtime object
timer = Realtime()

# sending timers to frontend
def get_timers(request):
    logger.info("Sending realtime timers")
    timer.det_timers()
    timers = timer.timers
    logger.info("realtime passed")
    logger.info(timers)
    return HttpResponse(timers,content_type="application/json")