# A counter that counts how many cars are detected
# TODO: adding different derections, type of objects

class Counter:
    def __init__(self):
        self.count = 0

    def inc(self,num):
        self.count = self.count + num

    def print_counter(self):
        print(self.count)  

    def reset_counter(self):
        self.count = 0  
    
