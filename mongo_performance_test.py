"""
Stress test MongoDB via PyMongo to evaluate MongoDB performance.
"""

import random
import time
from datetime import datetime
from os import getenv
from pprint import pprint
from timeit import timeit

from dotenv import load_dotenv
from pymongo import MongoClient

# Get MongoDB credentials
load_dotenv()
USER = "stress"
SECRET = getenv(f"{USER.upper()}_SECRET")
if not SECRET:
    raise SystemExit(f"ERROR: Unable to retrieve MongoDB secret for user {USER}")
CONNECTION_STRING = f"mongodb+srv://{USER}:{SECRET}@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority"

mongo_db = MongoClient(CONNECTION_STRING)['carat']

KEEP_PRIORITIES = [
    "Perceptible task",
    "Visible task",
    "Foreground app",
    "Foreground service",
    "Background process"
]

TIMESTAMP_MIN = 1427865499
TIMESTAMP_MAX = 1514764800

def get_anomalies_pipeline(uuid, start_timestamp, end_timestamp):
    """
    Builds and returns MongoDB aggregation pipeline to query anomaly data based
    on uuid and a timestamp range.
    Expects UNIX timestamps for parameters start_timestamp and end_timestamp
    """
    if not start_timestamp:
        start_timestamp = 0
    if not end_timestamp:
        end_timestamp = time.time()
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
        end_timestamp = int(time.time())
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

def get_categorized_pipeline(uuid):
    """
    Builds and returns MongoDB aggregation pipeline to get samples for the uuid
    with a category list corresponding to each running (filtered by priority)
    app
    """
    categorized_pipeline = [
        {
            "$match": { "uuid" : uuid }
        },
        {
            "$unwind": {
                "path": "$apps"
            }
        },
        {
            "$match": {
                "apps.priority": {
                    "$in": KEEP_PRIORITIES
                }
            }
        },
        {
            "$lookup": {
                "from": "categories",
                "localField": "apps.processName",
                "foreignField": "processName",
                "as": "category"
            }
        },
        {
            "$group": {
                "_id": {
                    "uuid": "$uuid",
                    "timestamp": "$timestamp",
                    "timeZone": "$timeZone",
                    "batteryLevel": "$batteryLevel",
                    "batteryStatus": "$batteryStatus"
                },
                "categoryList": { "$push": { "$arrayElemAt": ["$category.categoryName", 0] } }
            }
        },
        {
            "$project": {
                "_id": 0,
                "uuid": "$_id.uuid",
                "timestamp": "$_id.timestamp",
                "timeZone": "$_id.timeZone",
                "batteryLevel": "$_id.batteryLevel",
                "batteryStatus": "$_id.batteryStatus",
                "categoryList": 1
            }
        }
    ]
    return categorized_pipeline

def get_uuid(username):
    mongo_db['users'].find_one({'username': username}, {'_id':0})

def test_get_uuid(usernames):
    username = get_rand(usernames)
    get_uuid(username)

def get_anomalies(uuid, start_timestamp, end_timestamp):
    anomalies_pipeline = get_anomalies_pipeline(uuid, start_timestamp, end_timestamp)
    mongo_db['anomalies'].aggregate(anomalies_pipeline)

def test_get_anomalies(uuids):
    uuid = get_rand(uuids)
    start_ts, end_ts = get_rand_ts_range(TIMESTAMP_MIN, TIMESTAMP_MAX)
    get_anomalies(uuid, start_ts, end_ts)

def get_sunburst(uuid, start_timestamp, end_timestamp):
    sunburst_pipeline = get_sunburst_pipeline(uuid, start_timestamp, end_timestamp)
    mongo_db['samples'].aggregate(sunburst_pipeline)

def test_get_sunburst(uuids):
    uuid = get_rand(uuids)
    start_ts, end_ts = get_rand_ts_range(TIMESTAMP_MIN, TIMESTAMP_MAX)
    get_sunburst(uuid, start_ts, end_ts)

def get_categorized(uuid):
    categorized_pipeline = get_categorized_pipeline(uuid)
    mongo_db['samples'].aggregate(categorized_pipeline)

def test_get_categorized(uuids):
    uuid = get_rand(uuids)
    get_categorized(uuid)

def get_usernames():
    return list(mongo_db['users'].distinct('username'))

def get_uuids():
    return list(mongo_db['samples'].distinct('uuid'))

def get_rand(lst):
    return lst[random.randrange(len(lst))]

def get_rand_ts_range(mini, maxi):
    """ Returns (range start, range stop) """
    rand1 = random.randrange(mini, maxi)
    rand2 = random.randrange(mini, maxi)
    if rand1 > rand2:
        return rand2, rand1
    else:
        return rand1, rand2

def run_test(fn, param=None, iterations=1000, verbose=False):
    stime = time.time_ns()
    for _ in range(iterations):
        fn(param)
    etime = time.time_ns()

    time_per_op = (etime - stime)/10**9/iterations
    if verbose:
        print(f'Seconds per op: {time_per_op}')
    return time_per_op


if __name__ == "__main__":
    usernames = get_usernames()
    uuids = get_uuids()

    print('Initiating test on username to uuid mapping...')
    run_test(test_get_uuid, param=usernames, iterations=1000, verbose=True)
    print('Initiating test on fetching anomalies...')
    run_test(test_get_anomalies, param=uuids, iterations=1000, verbose=True)
    print('Initiating test on fetching sunburst data...')
    run_test(test_get_sunburst, param=uuids, iterations=1000, verbose=True)
    print('Initiating test on getting categorized samples for ML algorithm input...')
    run_test(test_get_categorized, param=uuids, iterations=100, verbose=True)
