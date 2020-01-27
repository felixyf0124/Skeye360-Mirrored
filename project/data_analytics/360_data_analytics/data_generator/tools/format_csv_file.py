"""This module is to format csv file generate from tsimulus generator"""
import pandas as pd


# Read csv file
def format_csv(filename):
    """This method is to read csv file and return a data_frame which index is date"""
    data_frame = pd.read_csv('../csv/test.csv', index_col=['date'], parse_dates=['date'], delimiter=";")
    return data_frame
