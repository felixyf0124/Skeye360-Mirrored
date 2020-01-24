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
realtimers = Realtime()

# sending timers to frontend
def get_timers(request):
    logger.info("Sending realtime timers")
    timers = realtimers.det_timers()
    return HttpResponse(timers,content_type="application/json")