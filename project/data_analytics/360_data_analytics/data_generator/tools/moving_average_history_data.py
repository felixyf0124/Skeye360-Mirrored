import chardet
import logging
import pandas as pd

LOGGER = logging.getLogger('moving_average.py')


def drop_na(data_frame):
    """Drop NA from csv file """
    LOGGER.info("drop NA")
    return data_frame.dropna(inplace=True)


# ==================CSV ============================
# Ref: https://stackoverflow.com/questions/33819557/unicodedecodeerror-utf-8-codec-while-reading-a-csv-file/33819765
# Unknown encode csv file
with open('test.csv', 'rb') as f:
    result = chardet.detect(f.read())  # or readline if the file is large

# Read csv file
df = pd.read_csv('test.csv', encoding=result['encoding'])

print(df.head())
# df['4-hrs-SMA'] = df['value'].rolling(window=4).mean()
# print(df['4-hrs-SMA'])
# # plt.plot(df['value'])
# # plt.figure(figsize=(3, 4))
# # plt.show()
# df2 = pd.DataFrame.from_dict({'A': {1: datetime.datetime.now()}})
# print(df2.head())
# records = json.loads(df2.T.to_json()).values()
# print(records)
# db.reviews.insert(records)
# df3 = db.reviews.find_one()
# print(df3.head())
