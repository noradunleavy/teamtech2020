"""
mongo_connection.py

Contains MongoConnection class

Author(s): Samantha Walter <sjw2@illinois.edu>
"""

from pymongo import MongoClient


class MongoConnection:
    """
    Manages connection with MongoDB for one database and enables switching
    among collections within the database.
    """

    def __init__(self, uri, db, collection):
        self._client = MongoClient(uri)
        self.set_db(db)
        self.set_collection(collection)

    def __repr__(self):
        return repr(self.collection)

    def __str__(self):
        return f"{self.__class__.__name__}(db='{self.db_name}', collection='{self.collection_name}')"

    def set_db(self, db):
        """
        Sets attributes db_name and db
        Raises Exception if db does not exist
        """
        if db not in self._client.list_database_names():
            raise Exception("Database does not exist")
        self.db_name = db
        self.db = self._client[db]

    def set_collection(self, collection):
        """
        Sets attributes collection_name and collection
        Raises Exception if collection does not exist in currently set db
        """
        if collection not in self.db.list_collection_names():
            raise Exception(f"Collection does not exist in database {self.db}")
        self.collection_name = collection
        self.collection = self.db[collection]

    def get_distinct(self, key):
        """ Returns list of distinct values associated with key in collection """
        return self.collection.distinct(key)

    def get_one_doc(self, filter=None, projection=None):
        """ Get a single document from the collection. Returns a dict or None """
        return self.collection.find_one(filter=filter, projection=projection)

    def get_docs(self, filter=None, projection=None, skip=0, limit=0):
        """ Query the database. Returns instance of Cursor """
        return self.collection.find(filter=filter, projection=projection, skip=skip, limit=limit)
