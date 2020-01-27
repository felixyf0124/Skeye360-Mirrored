"""This module is to read csv file and save to database"""
import logging
from tools.format_csv_file import read_format_csv
from db_connection.db_connection import DBConnection

LOGGER = logging.getLogger('insert_history_moving_average_data_main.py')


def drop_na(data_frame):
    """Drop NA from csv file """
    LOGGER.info("drop NA")
    return data_frame.dropna(inplace=True)


def main():
    """This function is to calculate MA and insert history MA data from csv to mongoDB"""
    logging.info('main')
    read_file_name = 'csv/test.csv'
    index_col = 'date'
    delimiter = ';'
    # Step 1: get the csv file
    data_frame = read_format_csv(read_file_name, index_col, delimiter)
    data_frame['value'] = data_frame['value'].rolling(window=4).mean()
    data_frame = drop_na(data_frame)
    new_post = []

    # Step 2: create a DB object
    data_base = DBConnection('360backend', 'myUserAdmin', 'abc123', 'localhost', '27017')

    # Step 3: Setup collection
    data_base.set_collection_name('djangosite_api_count')

    # Step 4: Find latest id
    count_latest_id = data_base.find_latest_id('djangosite_api_count')

    for index, row in data_frame.iterrows():
        new_count = {
            "id": count_latest_id + 1,
            "count_direction": row['series'],
            "count": row['value'],
            "time": index,
            "count_type": 'MA',
            "intersection_id_id": 1
        }
        count_latest_id = count_latest_id + 1
        new_post.append(new_count)

    # Step 4: insert to db
    data_base.insert_counts('djangosite_api_count', new_post)


if __name__ == "__main__":
    main()
