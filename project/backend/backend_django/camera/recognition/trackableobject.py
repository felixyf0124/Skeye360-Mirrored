
from .direction import Direction

class TrackableObject:
	def __init__(self, objectID):
		# store the object ID, then initialize a list of centroids
		# using the current centroid
		self.objectID = objectID
		self.centroids = []

		# initialize a boolean used to indicate if the object has
		# already been counted or not
		self.counted = False
		
		
		self.crossing = False
		self.start_from = ""
		self.go_to = ""

	def add_centroid(self, centroid):
		self.centroids.append(centroid)
		
	def print_to(self):
		for centroid in self.centroids:
			print ("["+str(centroid[0])+","+str(centroid[1])+"]")
			
	def get_start_from(self):
		return self.start_from
		
	def get_go_to(self):
		return self.go_to