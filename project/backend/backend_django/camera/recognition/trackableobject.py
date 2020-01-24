import logging

logger = logging.getLogger("camera")

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
		# logger.info("trackableObject is created")

	def add_centroid(self, centroid):
		self.centroids.append(centroid)
		# logger.info("centroid updated")

	def print_to(self):
		for centroid in self.centroids:
			# print ("["+str(centroid[0])+","+str(centroid[1])+"]")
			print("")
			
	def get_start_from(self):
		return self.start_from
		
	def get_go_to(self):
		return self.go_to