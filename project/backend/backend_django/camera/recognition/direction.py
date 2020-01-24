
import logging

logger = logging.getLogger("camera")

class Direction:
	def __init__(self, start_from, go_to):
		self.start_from = start_from
		self.go_to = go_to
		# logger.info("Direction is created")
		
	def print_direction(self):
		# print(self.start_from + "->" + self.go_to, end="")
		print("")
   
	def get_direction(self):
		return (self.start_from + "->" + self.go_to)
		
