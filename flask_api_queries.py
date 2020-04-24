"""
flask_api_queries.py

TODO: Module docstring

Author(s):  Samantha Walter <sjw2@illinois.edu>
"""

from pprint import pprint

from mongo_connection import MongoConnection

USER = "read"
PWD = ""
CONNECTION_STRING = f"mongodb+srv://{USER}:{PWD}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"


if __name__ == "__main__":

    example_doc = {
        "uuid": "5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe",
        "timestamp": 1513103100,
        "batteryLevel": 33,
        "batteryStatus": "charging",
        "timeZone": "Europe/Berlin",
        "mobileCountryCode": "de",
        "apps":
        [
            {
                "processName": "com.samsung.android.sm",
                "priority": "Foreground app"
            },
            {
                "processName": "com.sec.android.app.taskmanager",
                "priority": "Foreground app"
            },
            {
                "processName": "com.samsung.ucs.ucspinpad",
                "priority": "Service"
            },
            {
                "processName": "com.samsung.ucs.agent.boot",
                "priority": "Service"
            },
            {
                "processName": "com.sec.android.gallery3d",
                "priority": "Foreground app"
            },
            {
                "processName": "com.android.calendar",
                "priority": "Foreground app"
            },
            {
                "processName": "com.google.android.youtube",
                "priority": "Not a priority"
            }
        ]
    }


    pipeline = [
        {
            "$match": {
                "uuid": "5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe"
                # ,
                # "timestamp": {
                #     "$gt": 1512468142,
                #     "$lt": 1512512500
                # }
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
            "$project": {
                "_id": 0,
                "processName": "$_id",
                "numSamplesActiveDuring": 1
            }
        },
        {
            "$lookup": {
                "from": "categories",
                "localField": "processName",
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
            "$project": {
                "category": 0
            }
        }
    ]

    mongo = MongoConnection(CONNECTION_STRING, "carat", "samples")
    ret = mongo.db.samples.aggregate(pipeline)
    ret_lst = list(ret)
    pprint(ret_lst)
    print(len(ret_lst))
