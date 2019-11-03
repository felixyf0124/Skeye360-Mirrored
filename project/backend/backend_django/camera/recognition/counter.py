# A counter that counts how many cars are detected
# TODO: adding different derections, type of objects

from .direction import Direction

class Counter:
    def __init__(self,start_from, go_to):
        self.direction = Direction(start_from, go_to)
        self.count = 0

    def inc(self):
        self.count = self.count + 1
    
    def print_counter(self):
        self.direction.print_direction()
        print(": " + str(self.count))

    def reset_counter(self):
        self.count = 0

    def get_count(self):  
        return self.count
	
	
	
    
