# A counter that counts how many cars are detected
import logging
from .direction import Direction

logger = logging.getLogger("camera")

class Counter:
    def __init__(self,start_from, go_to):
        self.direction = Direction(start_from, go_to)
        self.count = 0
        # logger.info("Counter is created")

    def inc(self):
        self.count = self.count + 1
        # logger.info("Counter incremented")

    
    def print_counter(self):
        self.direction.print_direction()
        print(": " + str(self.count))

    def reset_counter(self):
        self.count = 0

    def get_count(self):  
        return self.count
	
	
	
    
