"""
clean_sample.py

Module to query database, encode, clean, and format samples into a dataframe
fit for input into the ML algorithm.

Author(s):  Samantha Walter <sjw2@illinois.edu>
            Ankitha Damisetty <ankithad@illinois.edu>
            Shreyah Prasad <sprasa20@illinois.edu>
            Emily Vera <evera5@illinois.edu>
"""

from collections import Counter, OrderedDict
from pprint import pprint

from pandas import DataFrame, Timestamp
from pymongo import MongoClient


USER = "read"
PWD = ""
CONNECTION_STRING = f"mongodb+srv://{USER}:{PWD}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"

PRIORITY_MAPPING = {
    "Perceptible task": 1,
    "Visible task": 2,
    "Foreground app": 3,
    "Foreground service": 4,
    "Background process": 5,
    "Unknown": 6,
    "Service": 7,
    "disabled": 8,
    "replaced": 9,
    "uninstalled": 10
}
KEEP_PRIORITIES = [
    "Perceptible task",
    "Visible task",
    "Foreground app",
    "Foreground service",
    "Background process"
]
BATTERY_STATUS_MAPPING = {
    "full": 1,
    "charging": 2,
    "discharging": 3,
    "not charging": 4
}
CATEGORIES = [
    "ART_AND_DESIGN",
    "AUTO_AND_VEHICLES",
    "BEAUTY",
    "BOOKS_AND_REFERENCE",
    "BUSINESS",
    "COMICS",
    "COMMUNICATION",
    "DATING",
    "EDUCATION",
    "ENTERTAINMENT",
    "EVENTS",
    "FINANCE",
    "FOOD_AND_DRINK",
    "GAME_ACTION",
    "GAME_ADVENTURE",
    "GAME_ARCADE",
    "GAME_BOARD",
    "GAME_CARD",
    "GAME_CASINO",
    "GAME_CASUAL",
    "GAME_EDUCATIONAL",
    "GAME_MUSIC",
    "GAME_PUZZLE",
    "GAME_RACING",
    "GAME_ROLE_PLAYING",
    "GAME_SIMULATION",
    "GAME_SPORTS",
    "GAME_STRATEGY",
    "GAME_TRIVIA",
    "GAME_WORD",
    "HEALTH_AND_FITNESS",
    "HOUSE_AND_HOME",
    "LIBRARIES_AND_DEMO",
    "LIFESTYLE",
    "MAPS_AND_NAVIGATION",
    "MEDIA_AND_VIDEO",
    "MEDICAL",
    "MUSIC_AND_AUDIO",
    "NEWS_AND_MAGAZINES",
    "PARENTING",
    "PERSONALIZATION",
    "PHOTOGRAPHY",
    "PRODUCTIVITY",
    "SHOPPING",
    "SOCIAL",
    "SPORTS",
    "TOOLS",
    "TRANSPORTATION",
    "TRAVEL_AND_LOCAL",
    "VIDEO_PLAYERS",
    "WEATHER"
]

def get_priority_map():
    """ Returns dictionary mapping app priority to int [1,10] """
    return PRIORITY_MAPPING

def get_battery_status_map():
    """ Returns dictionary mapping batteryStatus to int [1,4] """
    return BATTERY_STATUS_MAPPING

def get_process_category(process_name):
    """ Returns category name for given process name by querying Mongo """
    mongo_db = MongoClient(CONNECTION_STRING)["carat"]
    result = mongo_db["categories"].find_one({"processName": process_name}, {"_id": 0})
    if result:
        return result["categoryName"]

def get_docs_with_category_list(mongo_db, uuid):
    """ Returns Cursor to docs for uuid with list of app categories filtered by priority """
    cat_list_pipeline = [
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
    return mongo_db["samples"].aggregate(cat_list_pipeline)

def convert_timestamp(timestamp, time_zone):
    """
    Returns pandas Timestamp object -- timezone unaware with local time --
    from UTC timestamp
    """
    ts_utc = Timestamp(timestamp, unit="s", tz="UTC")
    ts_tz_aware = ts_utc.astimezone(time_zone)
    ts = ts_tz_aware.tz_localize(None)
    return ts

def encode_priority(priority):
    """ Returns encoding of app priority """
    if priority in PRIORITY_MAPPING:
        return PRIORITY_MAPPING[priority]
    else:
        return -1

def encode_battery_status(battery_status):
    """ Returns encoding of batteryStatus """
    if battery_status in BATTERY_STATUS_MAPPING:
        return BATTERY_STATUS_MAPPING[battery_status]
    else:
        return -1

def get_category_counts(category_list):
    """
    Returns OrderedDict with count of each category including categories with
    count of 0
    """
    cnt = Counter(category_list)
    category_counts = OrderedDict()
    for category in CATEGORIES:
        category_counts[category] = cnt[category]
    return category_counts

def encode_doc(doc):
    """ Returns OrderedDict with encoded values
        Columns (4 + 51 categories):
            "uuid"          : [str],
            "ds"            : [pd.Timestamp],
            "batteryLevel"  : [int[0,99]],
            "batteryStatus" : [int[0,4]],
            categoryName    : [int]
    """
    ordered_dict = OrderedDict(
        {
            "uuid":             doc["uuid"],
            "ds":               convert_timestamp(doc["timestamp"], doc["timeZone"]),
            "batteryLevel":     doc["batteryLevel"],
            "batteryStatus":    encode_battery_status(doc["batteryStatus"])
        }
    )
    ordered_dict.update(get_category_counts(doc["categoryList"]))
    return ordered_dict

#TODO: Implement me
def drop_unwanted(dataframe):
    """ Returns dataframe with unwanted rows/columns removed """
    # Remove rows with invalid encoding
    dataframe = dataframe[dataframe.batteryStatus != -1]

    return dataframe

def get_dataframe(uuid):
    """ Returns clean dataframe with all samples for user uuid """
    # Connect to Mongo
    mongo_db = MongoClient(CONNECTION_STRING)["carat"]

    # Build list of encoded samples
    doc_list = [ encode_doc(sample)
                 for sample in get_docs_with_category_list(mongo_db, uuid) ]

    # Convert list of samples to dataframe
    df = DataFrame(doc_list)

    # Drop unwanted rows/columns
    df = drop_unwanted(df)

    return df

def save_as_csv(df, path):
    """ Saves DataFrame to given path """
    df.to_csv(path)

def print_categories(uuid):
    """
    INFORMATIVE ONLY; DON'T USE IN PRACTICE.
    Prints category mapping for one sample from one user
    """
    mongo_db = MongoClient(CONNECTION_STRING)["carat"]
    for sample in mongo_db["samples"].find({"uuid": uuid}, limit=1):
        for app in sample["apps"]:
            ret = get_process_category(app["processName"])
            print(f"{str(ret):>19} {app['processName']}")


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

    ## Test Individual Parts

    # mongo_db = MongoClient(CONNECTION_STRING)["carat"]

    # ## Test get docs with categoryList
    # docs = get_docs_with_category_list(mongo_db, example_doc["uuid"])
    # doc_list = list(docs)
    # pprint(doc_list)
    # print(len(doc_list))

    # ## Test category counts
    # for doc in doc_list:
    #     pprint(get_category_counts(doc["categoryList"]))

    # ## Test encode_doc
    # converted = encode_doc(example_doc)
    # pprint(converted)

    # ## Test convert_ordered on list
    # converted_list = [ encode_doc(sample)
    #                    for sample in doc_list ]

    # ## Test dataframe convertion
    # df = DataFrame(converted_list)
    # print(df)

    # ## Test cleaning
    # df = drop_unwanted(df)
    # print(df)


    # ## Test all
    df = get_dataframe(example_doc["uuid"])
    print(df)
    # save_as_csv(df, "./sample_dataframe.csv")
