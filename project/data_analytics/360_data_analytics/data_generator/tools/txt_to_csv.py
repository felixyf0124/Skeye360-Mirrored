"""This module is read txt file and format it to csv file according to your requirement"""
# Ref:https://stackoverflow.com/questions/39642082/convert-txt-to-csv-python-script
import logging
import csv
import sys

LOGGER = logging.getLogger('txt_to_csv.py')

def main():
    read_file_name = ''
    write_file_name = ''
    split_char = ''

    if len(sys.argv) == 4:
        read_file_name = sys.argv[1]
        split_char = sys.argv[3]
        write_file_name = sys.argv[2]
    else:
        raise Exception("Please follow the format: python txt_to_csv.py read_file_name write_file_name split_char")

    with open(read_file_name, 'r') as in_file:
        stripped = (line.strip() for line in in_file)
        lines = (line.split(split_char) for line in stripped if line)
        with open(write_file_name, 'w') as out_file:
            writer = csv.writer(out_file)
            writer.writerows(lines)


if __name__ == "__main__":
    main()
