"""
api.py

Flask API designed to fetch data needed for web visualizations from MongoDB.

Author(s):  Samantha Walter <sjw2@illinois.edu>
            Alycia Bhargava <alyciab2@illinois.edu>
            Niharika Dangarwala <ndanga2@illinois.edu>
"""

from time import time
from datetime import datetime

from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient


USER = 'frontend'
SECRET = ''
URI = f'mongodb+srv://{USER}:{SECRET}@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority'
mongo_db = MongoClient(URI)['carat']

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello, World!'

@app.route('/categories/<processName>', methods=['GET'])
def get_one_category(processName):
    response = mongo_db['categories'].find_one({'processName': processName}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'
    return

@app.route('/samples', methods=['GET'])
def get_all_samples():
    """ Returns enumerated dict of a limit of 5 documents """
    response = {}
    for num,doc in enumerate(mongo_db['samples'].find(None,{'_id':0}).limit(5)):
        response[num] = doc
    return response

@app.route('/samples/<uuid>', methods=['GET'])
def get_one_sample(uuid):
    response = mongo_db['samples'].find_one({'uuid': uuid}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'

@app.route('/anomalies/<uuid>')
def get_anomalies(uuid):
    """
    Returns single document containing matching uuid and list of anomalies with
    keys for Timestamp, Category, and Type. If query results are empty, returns
    'No matches'.
    Takes optional query parameters start and end as UNIX timestamps to limit
    query range. If no timestamps are given, results between timestamp 0 and
    the current time are returned.
    Example: /anomalies/5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe?start=1512468142&end=1512500000
    """
    # Get query arguments
    start_timestamp = request.args.get('start')
    end_timestamp = request.args.get('end')

    pipeline = get_anomalies_pipeline(uuid, start_timestamp, end_timestamp)
    mongo_cursor = mongo_db['anomalies'].aggregate(pipeline)
    response_lst = list(mongo_cursor)
    if response_lst:
        return response_lst[0]
    else:
        return 'No matches'

@app.route('/sunburst/')
def get_sunburst_data():
    """
    Expects query parameters uuid, start (optional), and end (optional)
    Example: /sunburst/?uuid=5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe&start=1512468142&end=1512512500
    Returns dictionary of sunburst content. If query results are empty, returns 'No matches'
    """
    # Get query arguments
    uuid = request.args.get('uuid')
    start_timestamp = request.args.get('start')
    end_timestamp = request.args.get('end')

    # Get MongoDB aggregation pipeline
    pipeline = get_sunburst_pipeline(uuid, start_timestamp, end_timestamp)
    mongo_cursor = mongo_db['samples'].aggregate(pipeline)
    response_lst = list(mongo_cursor)
    if response_lst:
        return response_lst[0]
    else:
        return 'No matches'

def get_anomalies_pipeline(uuid, start_timestamp, end_timestamp):
    """
    Builds and returns MongoDB aggregation pipeline to query anomaly data based
    on uuid and a timestamp range.
    Expects UNIX timestamps for parameters start_timestamp and end_timestamp
    """
    if not start_timestamp:
        start_timestamp = 0
    if not end_timestamp:
        end_timestamp = time()
    start_datetime = datetime.fromtimestamp(int(start_timestamp))
    end_datetime = datetime.fromtimestamp(int(end_timestamp))

    # print(start_datetime, datetime.timestamp(start_datetime))
    # print(end_datetime, datetime.timestamp(end_datetime))

    anomalies_pipeline = [
        {
            "$match": {
                "uuid": uuid
            }
        },
        {
            "$unwind": {
                "path": "$anomalies"
            }
        },
        {
            "$match": {
                    "anomalies.Timestamp": {
                    "$gt": start_datetime,
                    "$lt": end_datetime
                }
            }
        },
        {
            "$group": {
                "_id": "$uuid",
                "anomalies": { "$push": "$anomalies" }
            }
        },
        {
            "$set": {
                "uuid": "$_id"
            }
        },
        {
            "$project": {
                "_id": 0
            }
        }
    ]
    return anomalies_pipeline

def get_sunburst_pipeline(uuid, start_timestamp, end_timestamp):
    """
    Builds and returns MongoDB aggregation pipeline for sunburst.
    Expects UNIX timestamps for parameters start_timestamp and end_timestamp
    """
    if not start_timestamp:
        start_timestamp = 0
    if not end_timestamp:
        end_timestamp = int(time())
    start_timestamp = int(start_timestamp)
    end_timestamp = int(end_timestamp)

    sunburst_pipeline = [
        {
            "$match": {
                "uuid": uuid,
                "timestamp": {
                    "$gt": start_timestamp,
                    "$lt": end_timestamp
                }
            }
        },
        {
            "$unwind": {
                "path": "$apps"
            }
        },
        {
            "$match": {
                "apps.priority": {
                    "$in": [ "Perceptible task", "Visible task", "Foreground app", "Foreground service" ]
                }
            }
        },
        {
            "$group": {
                "_id": "$apps.processName",
                "numSamplesActiveDuring": { "$sum": 1 }
            }
        },
        {
            "$lookup": {
                "from": "categories",
                "localField": "_id",
                "foreignField": "processName",
                "as": "category"
            }
        },
        {
            "$unwind": {
                    "path": "$category",
                    "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$set": {
                "categoryName": "$category.categoryName"
            }
        },
        {
            "$group": {
                "_id": "$categoryName",
                "children": {
                    "$push": {
                        "name": "$_id",
                        "size": "$numSamplesActiveDuring"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "children": {
                    "$push": {
                        "name": "$_id",
                        "children": "$children"
                    }
                }
            }
        },
        {
            "$set": {
                "name": "Category"
            }
        },
        {
            "$project": {
                "_id": 0
            }
        }
    ]
    return sunburst_pipeline


if __name__ == '__main__':
    app.run(debug=True)
