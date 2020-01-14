#Ref:https://stackoverflow.com/questions/39642082/convert-txt-to-csv-python-script
import csv

with open('test.txt', 'r') as in_file:
    stripped = (line.strip() for line in in_file)
    lines = (line.split(";") for line in stripped if line)
    with open('test.csv', 'w') as out_file:
        writer = csv.writer(out_file)
        writer.writerows(lines)