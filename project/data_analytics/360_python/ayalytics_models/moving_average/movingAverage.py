import pandas as pd
import json
import datetime
from dbConnection import dbConnection
from pprint import pprint
from random import randint
import matplotlib.pyplot as plt


def dropNa(df):
    return df.dropna(inplace=True)


def moving_average(self):
    print('MA')


# Step 1: Link with MA server and database
db = dbConnection('360backend', 'myUserAdmin', 'abc123', 'localhost', '27017')

# #Step 2: Create sample data
# names = ['Kitchen', 'Animal', 'State', 'Tastey', 'Big', 'City', 'Fish', 'Pizza', 'Goat', 'Salty', 'Sandwich',
#          'Lazy', 'Fun']
# company_type = ['LLC', 'Inc', 'Company', 'Corporation']
# company_cuisine = ['Pizza', 'Bar Food', 'Fast Food', 'Italian', 'Mexican', 'American', 'Sushi Bar', 'Vegetarian']
# for x in range(1, 501):
#     business = {
#         'name': names[randint(0, (len(names) - 1))] + ' ' + names[randint(0, (len(names) - 1))] + ' ' +
#                 company_type[randint(0, (len(company_type) - 1))],
#         'rating': randint(1, 5),
#         'cuisine': company_cuisine[randint(0, (len(company_cuisine) - 1))]
#     }
#     # Step 3: Insert business object directly into MongoDB via isnert_one
#     result = db.reviews.insert_one(business)
#     # Step 4: Print to the console the ObjectID of the new document
#     print('Created {0} of 500 as {1}'.format(x, result.inserted_id))
# # Step 5: Tell us that you are done
# print('finished creating 500 business reviews')

# Read recent
# fivestars = db['reviews'].find()
# array = pd.DataFrame(list(fivestars))
# print(array)

# Example format
# newCount = {
#     "id" : 1
#     "direction": 'WE',
#     "count": 14,
#     "time": datetime.datetime.now(),
#     "count_type": 'MA',
#     "intersection_id_id": 1}

db.insert_one('djangosite_api_count', 'WE', 14, datetime.datetime.now(), 'MA', 1)

# Read mongoDB get CSV file
array2 = db.read_mongo('djangosite_api_count')

print(array2)

# For CSV file
# for x in array:
#     y = x['name']
#     print(y)
# # read csv file
# df = pd.read_csv('test.csv', index_col='date', parse_dates=True)
#
# # drop no value row
# df.dropna(inplace=True)
# print(df.head())
# print(df.index)
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
