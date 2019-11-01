import json
class Coordinate:
	def __init__(self):
		# store the coordinates
		self.dict ={}
		
	def print_coordinate(self):
		for t in self.dict.items():
			print(t)
	def print_json(self):
		values = [{"id":k,"coord":v} for k,v in self.dict.items()]
		print(json.dumps(values,indent=2))
	def json_coord(self):
		values = [{"id":k,"coord":v} for k,v in self.dict.items()]
		return json.dumps(values,indent=2)