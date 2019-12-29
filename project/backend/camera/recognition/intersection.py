import logging
from .counter import Counter

logger = logging.getLogger("camera")

class Intersection:
    def __init__(self, name):
        self.name = name
        self.counters = []
        logger.info("Intersection is created")

    def add_counter(self, start_from, go_to):
        counter = Counter(start_from, go_to)
        self.counters.append(counter)
        logger.info("Counter is added")

    def inc(self, start_from, go_to):
        for c in self.counters:
            if start_from == c.direction.start_from and go_to == c.direction.go_to:
                c.inc()

    def print_counters(self):
        for c in self.counters:
            c.print_counter()

    def reset_counter(self):
        for c in self.counters:
            c.count = 0        
        logger.info("Counter is reset")
