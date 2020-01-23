import time, schedule
from main import main

def callMain():
    mainObj = main()
    mainObj.mainArima()

schedule.every(1).minutes.do(callMain)

while True:
    schedule.run_pending()
    time.sleep(1)