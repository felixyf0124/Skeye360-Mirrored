"""This module is to format csv file generate from tsimulus generator"""
import logging
import pandas as pd

LOGGER = logging.getLogger('format_csv_file.py')


# Read csv file
def read_format_csv(filename, index_col, delimiter):
    """This method is to read csv file and return a data_frame which index is date"""
    LOGGER.info('format_csv')
    data_frame = pd.read_csv(filename, index_col=[index_col], parse_dates=[index_col],
                             delimiter=delimiter)

    return data_frame
