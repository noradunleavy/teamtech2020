'''
A basic walk through of accessing the MongoDB Cluster using PyMongo.
Before running, type the password string where indicated in code.
WARNING: running this script as is will print a lot to the terminal.

Requirements:
    - pymongo
    - dnspython: must be installed to connect to cloud mongo server

Author: Samantha Walter <sjw2@illinois.edu>
'''

from pprint import pprint

import pymongo

user = 'read'
pwd = 'PASSWORD'    # FIXME: replace PASSWORD before running
connectionString = f"mongodb+srv://{user}:{pwd}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"
print(f"Connection String: {connectionString}")

# Connect to instance
client = pymongo.MongoClient(connectionString)

# Print databases
print(f"Databases: {client.list_database_names()}")

# Use carat db
db = client.carat
print("Using db carat")
print(f"Collections: {db.list_collection_names()}")

# Get one document from the usage collection
ret = db.usage.find_one()
print(type(ret))
pprint(ret)

# Get 3 documents with specific uuid
spec = {"uuid": "eb20b8b2103f98d5f3418dfe461502a0fa3d82429460703569868243d25cc56c"}
limit = 3
ret = db.usage.find(spec).limit(limit)
print(type(ret))
for doc in ret:
    pprint(doc)     # Iterate over cursor to print docs
ret.rewind()        # Cursor has been evaluated; need to rewind to reuse
results = list(ret) # Or use list convertion to get all results

# Aggregation: Get number of unique uuids
aggr = [
    {"$group": {"_id": "$uuid"}},
    {"$count": "num_unique_uuid"}
]
ret = db.usage.aggregate(aggr)
print(type(ret))
pprint(list(ret))
