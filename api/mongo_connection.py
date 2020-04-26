"""
Contains MongoConnection class
Author: Samantha Walter <sjw2@illinois.edu>
"""

from pymongo import MongoClient


class MongoConnection:
    """ Manages connection with MongoDB for one database and enables switching
        among collections within the database.
    """

    def __init__(self, uri, db='carat'):
        client = MongoClient(uri)
        if db not in client.list_database_names():
            raise Exception("Database does not exist")
        self.db_name = db
        self.db = client[db]
        self.collection_name = None
        self.collection = None

    def __str__(self):
        return f"MongoDatabase(db={repr(self.db_name)}, collection={repr(self.collection_name)})"

    def get_db_name(self):
        """ Returns database name """
        return self.db_name

    def get_collection_name(self):
        """ Returns collection name """
        return self.collection_name

    def get_collection(self):
        """ Returns collection object """
        return self.collection

    def set_collection(self, collection):
        """ Checks collection existence in database, sets collection name,
            sets collection object
        """
        if collection not in self.db.list_collection_names():
            raise Exception(f"Collection does not exist in database {self.db}")
        self.collection_name = collection
        self.collection = self.db[collection]
