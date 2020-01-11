import pandas as pd
from dbConnection import dbConnection
from pprint import pprint
from random import randint
import matplotlib.pyplot as plt


def dropNa(df):
    return df.dropna(inplace=True)

def moving_average(self):
    print('MA')

# Link with server and database
db = dbConnection("360backend")
db = db.connection()
# Step 2: Create sample data
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


fivestars = db.djangosite_api_count.find_one()
print(fivestars)

# read csv file
df = pd.read_csv('test.csv', index_col='date', parse_dates=True)

# drop no value row
df.dropna(inplace=True)
print(df.head())
print(df.index)
df['4-hrs-SMA'] = df['value'].rolling(window=4).mean()
print(df['4-hrs-SMA'])
# plt.plot(df['value'])
# plt.figure(figsize=(3, 4))
# plt.show()
