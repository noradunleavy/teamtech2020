'''
dnspython module must be installed to connect to cloud mongo server
'''

import pymongo

user = 'read'
pwd = 'sweillinois'
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

# Use usage collection
usage_coll = db.usage

# Get one document from the usage collection
ret = usage_coll.find_one()
print(type(ret))
print(ret)
