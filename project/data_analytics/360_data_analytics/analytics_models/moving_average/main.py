from moving_average import cal_one_hr_moving_average
from db_connection import DBConnection


def main():
    # Use Tuple to save directions
    # directions = ('ew', 'ws', 'ee', 'es', 'ww', 'wn', 'en', 'ws', 'sw', 'ss', 'sn', 'ne', 'ns',
    #               'nw', 'se')
    directions = ('se', 'ns', 'ew', 'wn', 'sn', 'en', 'es', 'sw', 'nw', 'ne', 'we', 'ws')
    intersecion_id = 1
    # Step 1: Link with MA server and database
    data_base = DBConnection('360backend', 'myUserAdmin', 'abc123', 'localhost', '27017')

    # Step 2: Setup collection
    data_base.set_collection_name('djangosite_api_count')

    # Step 3: Calculate and insert latest an hour's moving average for each direction
    cal_one_hr_moving_average(data_base, directions, intersecion_id)


if __name__ == "__main__":
    main()
