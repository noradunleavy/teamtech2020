"""
carat_db.py

I don't like how I did this class. Will be fixing a removing soon.

Author(s):  Samantha Walter <sjw2@illinois.edu>
"""

from mongo_connection import MongoConnection

class SamplesCollection():
    """ TODO """

    def __init__(self, uri):
        self.mongo = MongoConnection(uri, db='carat', collection='samples')
        self.keys = [
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

    def __call__(self):
        return self.mongo.collection

    def get_distinct(self, key):
        if key not in self.keys:
            raise Exception("Key does not exist")
        return self.mongo.collection.distinct(key)

    def get_uuids(self):
        return self.get_distinct('uuid')

    def get_all_docs(self):
        return self.mongo.collection.find()

    def get_docs(self, filter_=None, projection=None):
        return self.mongo.collection.find(filter_, projection)
