import sys
import io
import unittest
sys.path.append("..") 
from coordinate import Coordinate
from direction import Direction
from counter import Counter

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
        
    
        
        