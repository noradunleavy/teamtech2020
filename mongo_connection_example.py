"""
mongo_connection_example.py

Example for using class MongoConnection

Author(s): Samantha Walter <sjw2@illinois.edu>
"""

from mongo_connection import MongoConnection


USER = "read"
PWD = ""
CONNECTION_STRING = f"mongodb+srv://{USER}:{PWD}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"

# Build a connection object with the desired database
mongo = MongoConnection(CONNECTION_STRING, "carat", "samples")

# What the connection object looks like when printed
print(mongo)

# Class instance attributes
print(mongo.db_name)
print(mongo.collection_name)

# Query collection (.get_docs() calls .find())
prototype = {"uuid": "eb20b8b2103f98d5f3418dfe461502a0fa3d82429460703569868243d25cc56c"}
print(mongo.get_docs(prototype).limit(1))

# Change to another collection
mongo.set_collection("categories")
print(f"Collection is now {repr(mongo.collection_name)}")

# Another query on different collection (.get_one_doc() calls .find_one())
print(mongo.get_one_doc())

# Get all possible category names
categories = mongo.get_distinct("categoryName")
print(categories)
print(len(categories))

mongo.set_collection("samples")
# Get all battery level categorizations present in database
print(mongo.get_distinct("batteryStatus"))
# Access nested keys with .
print(mongo.get_distinct("apps.priority"))

# For reference, the keys in the sample collection are as follows
samples_keys = [
    '_id',
    'uuid',
    'timestamp',
    'batteryLevel',
    'batteryStatus',
    'timeZone',
    'mobileCountryCode',
    'apps',
    'apps.processName',
    'apps.priority'
]
