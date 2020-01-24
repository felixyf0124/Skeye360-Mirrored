from django.http import HttpResponse, JsonResponse
from .realtime import Realtime
import logging

logger = logging.getLogger("camera")

# initialize a realtime object
timer = Realtime()

# sending timers to frontend
def get_timers(request):
    logger.info("Sending realtime timers")
    timer.det_timers()
    timers_data = timer.timers
    logger.info("realtime passed")
    #logger.info(timers)
    logger.info(timers_data)
    return JsonResponse(timers_data)
