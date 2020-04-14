"""
Example for using class MongoConnection

Author: Samantha Walter <sjw2@illinois.edu>
"""

from mongo_connection import MongoConnection


user = 'read'
pwd = ''    # FIXME: replace PASSWORD before running
connectionString = f"mongodb+srv://{user}:{pwd}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"

# Build a connection object with the desired database
mongo = MongoConnection(connectionString, 'carat')

# What the connection object looks like when printed
print(mongo)

# Must set the collection before querying
mongo.set_collection('usage')

# Queries (.find() or .find_one() methods) are done on collection objects
spec = {"uuid": "eb20b8b2103f98d5f3418dfe461502a0fa3d82429460703569868243d25cc56c"}
print(mongo.get_collection().find(spec).limit(2))

# Change to another collection
mongo.set_collection('categories')
print(f"Collection is now {repr(mongo.get_collection_name())}")

# Another query on different collection
print(mongo.get_collection().find_one())
