import sys
import io
import unittest
sys.path.append("..") 
from coordinate import Coordinate
from direction import Direction
from counter import Counter
from trackableobject import TrackableObject
from coordinate import Coordinate
from intersection import Intersection

# Create your tests here.

class YourTestClass(unittest.TestCase):
    def setUp(self):
        print("setUp: Run once for every test method to setup clean data.")
        pass

    def test_false_is_false(self):
        print("Method: test_false_is_false.")
        self.assertFalse(False)
    
    def test_false_is_true(self):
        print("Method: test_false_is_true.")
        self.assertTrue(True)
    
    # testing direction class    
    def test_get_direction(self):
        direction = Direction("A","B")
        self.assertEqual(direction.get_direction(), "A->B")
        
    def test_direction_type(self):
        direction = Direction("A","B")
        self.assertTrue(type(direction) is Direction)
        
    def test_print_direction(self):
        direction = Direction("A","B")
        output = io.StringIO()                  
        sys.stdout = output                     
        direction.print_direction()                                     
        sys.stdout = sys.__stdout__             
        self.assertEqual(output.getvalue(), "A->B")
                 
    # testing counter class
    def test_counter_type(self):
        counter = Counter("A","B")
        self.assertTrue(type(counter) is Counter)
        
    def test_counter_inc(self):
        counter = Counter("A","B")
        counter.inc()
        self.assertTrue(counter.count is 1)
        
    def test_get_counter(self):
        counter = Counter("A","B")        
        self.assertTrue(counter.get_count() is 0)
        
    def test_reset_counter(self):
        counter = Counter("A","B")
        counter.inc()        
        self.assertTrue(counter.count is not 0)
        counter.reset_counter()        
        self.assertTrue(counter.count is 0)
    
    def test_print_counter(self):
        counter = Counter("A","B")
        output = io.StringIO()                  
        sys.stdout = output                     
        counter.print_counter()                                     
        sys.stdout = sys.__stdout__             
        self.assertEqual(output.getvalue(), "A->B: 0\n")
        
    # testing trackableobject class    
    def test_trackableoject_type(self):
        trackableoject = TrackableObject(1)
        self.assertTrue(type(trackableoject) is TrackableObject)
        centroids = trackableoject.centroids
        self.assertEqual(type(centroids), list)
        self.assertEqual(len(centroids), 0)

    def test_get_start_from(self):
        trackableoject = TrackableObject(1)
        trackableoject.start_from = "A"
        self.assertEqual(trackableoject.get_start_from(), "A")

    def test_get_go_to(self):
        trackableoject = TrackableObject(1)
        trackableoject.go_to = "B"     
        self.assertEqual(trackableoject.get_go_to(), "B")
        
    def test_add_centroid(self):
        trackableoject = TrackableObject(1)
        centroids = trackableoject.centroids
        self.assertEqual(len(centroids), 0)
        trackableoject.add_centroid([0,0])		
        self.assertEqual(len(centroids), 1)
    
    def test_print_to(self):
        trackableoject = TrackableObject(1)
        empty_output = io.StringIO()                  
        sys.stdout = empty_output 
        trackableoject.print_to()                                  
        sys.stdout = sys.__stdout__             
        self.assertEqual(empty_output.getvalue(), "")        
        trackableoject.add_centroid([0,0])		
        trackableoject.add_centroid([0,1])		
        trackableoject.add_centroid([0,2])		
        trackableoject.add_centroid([0,3])		
        output = io.StringIO()                  
        sys.stdout = output
        trackableoject.print_to()
        sys.stdout = sys.__stdout__             
        self.assertEqual(output.getvalue(), "[0,0]\n[0,1]\n[0,2]\n[0,3]\n")

    # testing coordinate class
    def test_coordinate_type(self):
        coordinate = Coordinate()
        self.assertTrue(type(coordinate) is Coordinate)
        coordinates_dictionary = coordinate.dict
        self.assertEqual(type(coordinates_dictionary), dict)


    # testing intersection class
    def test_intersection_type(self):
        intersection = Intersection("a@b")
        self.assertTrue(type(intersection) is Intersection)
        intersection_counters = intersection.counters
        self.assertEqual(type(intersection_counters), list)
    
    def test_add_counter(self):
        intersection = Intersection("a@b")
        intersection_counters = intersection.counters
        self.assertEqual(len(intersection_counters), 0)
        intersection.add_counter("A","B")
        self.assertEqual(len(intersection_counters), 1)
        self.assertTrue(type(intersection_counters[0]), Counter)

    def test_inc(self):
        intersection = Intersection("a@b")
        intersection.add_counter("A","B")
        intersection.add_counter("B","A")        
        intersection_counters = intersection.counters      
        for c in intersection_counters:
            self.assertEqual(c.count, 0)
        intersection.inc("A","B")    
        intersection.inc("B","A") 
        intersection.inc("B","A") 
        for c in intersection_counters:            
            if "A" == c.direction.start_from and "B" == c.direction.go_to:
                self.assertEqual(c.count, 1)
            if "B" == c.direction.start_from and "A" == c.direction.go_to:
                self.assertEqual(c.count, 2)

    def test_print_counters(self):
        intersection = Intersection("a@b")
        intersection.add_counter("A","B")
        intersection.add_counter("B","A")
        intersection.inc("A","B")
        output = io.StringIO()                  
        sys.stdout = output
        intersection.print_counters()
        sys.stdout = sys.__stdout__             
        self.assertEqual(output.getvalue(), "A->B: 1\nB->A: 0\n")

    def test_reset_counter(self):
        intersection = Intersection("a@b")
        intersection.add_counter("A","B")
        intersection.add_counter("B","A")
        intersection.inc("A","B")
        intersection.inc("A","B")
        intersection.inc("B","A")
        intersection.inc("A","B")
        intersection.inc("B","A")
        intersection.inc("A","B")
        intersection_counters = intersection.counters
        for c in intersection_counters:
            if "A" == c.direction.start_from and "B" == c.direction.go_to:
                self.assertEqual(c.count, 4)
            if "B" == c.direction.start_from and "A" == c.direction.go_to:
                self.assertEqual(c.count, 2)
        intersection.reset_counter()
        for c in intersection_counters:
            self.assertEqual(c.count, 0)
