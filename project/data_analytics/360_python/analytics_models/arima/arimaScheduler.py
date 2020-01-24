import time, schedule
from main import main

def callMain():
    mainObj = main()
    mainObj.mainArima()

schedule.every().day.at("02:00").do(callMain)

while True:
    schedule.run_pending()
    time.sleep(1)