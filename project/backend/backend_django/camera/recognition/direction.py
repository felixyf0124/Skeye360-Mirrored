
class Direction:
	def __init__(self, start_from, go_to):
		self.start_from = start_from
		self.go_to = go_to
		
	def print_direction(self):
		print(self.start_from + "->" + self.go_to, end="")
		
