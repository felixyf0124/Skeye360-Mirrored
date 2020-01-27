from django.http import HttpResponse, JsonResponse
from .realtime import Realtime
import logging

logger = logging.getLogger("camera")

# initialize a realtime object
timer = Realtime()

# sending timers to frontend
def get_timers(request):
    timer.det_timers()
    timers_data = timer.timers
    return JsonResponse(timers_data)
