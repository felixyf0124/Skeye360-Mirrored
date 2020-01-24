from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from .realtime import Realtime
import os
import logging
import threading
import queue

logger = logging.getLogger("timers")

# initialize a realtime object
timer = Realtime()

# sending timers to frontend
def get_timers(request):
    logger.info("Sending realtime timers")
    print("here in get_timers from the view")
    timer.det_timers()
    timers = timer.timers
    print("printing the timers")
    print(timers)
    return HttpResponse(timers,content_type="application/json")