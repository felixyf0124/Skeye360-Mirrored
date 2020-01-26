# Ref:https://stackoverflow.com/questions/39642082/convert-txt-to-csv-python-script
import csv
import sys

readFileName = ''
writeFileName = ''
splitChar = ''

if len(sys.argv) == 4:
    readFileName = sys.argv[1]
    splitChar = sys.argv[3]
    writeFileName = sys.argv[2]
    print(readFileName)
else:
    raise Exception("Please follow the format: python txt_to_csv.py readFileName writeFileName splitChar")

with open(readFileName, 'r') as in_file:
    stripped = (line.strip() for line in in_file)
    lines = (line.split(splitChar) for line in stripped if line)
    with open(writeFileName, 'w') as out_file:
        writer = csv.writer(out_file)
        writer.writerows(lines)
