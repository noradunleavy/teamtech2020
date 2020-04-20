"""
clean_sample.py

Module to query database, encode, clean, and format samples into a dataframe
fit as input a ML model.

Author(s):  Samantha Walter <sjw2@illinois.edu>
            Ankitha Damisetty <ankithad@illinois.edu>
            Shreyah Prasad <sprasa20@illinois.edu>
            Emily Vera <evera5@illinois.edu>
"""

from collections import OrderedDict
from pprint import pprint

from pandas import DataFrame, Timestamp

from mongo_connection import MongoConnection


USER = "read"
PWD = ""
CONNECTION_STRING = f"mongodb+srv://{USER}:{PWD}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"

PRIORITY_MAPPING = {
    "Background process": 1,
    "Foreground app": 2,
    "Foreground service": 3,
    "Perceptible task": 4,
    "Service": 5,
    "Unknown": 6,
    "Visible task": 7,
    "disabled": 8,
    "replaced": 9,
    "uninstalled": 10
}
BATTERY_STATUS_MAPPING = {
    "charging": 1,
    "discharging": 2,
    "full": 3,
    "not charging": 4
}

def get_priority_map():
    """ Returns dictionary mapping app priority to int [1,10] """
    return PRIORITY_MAPPING

def get_battery_status_map():
    """ Returns dictionary mapping batteryStatus to int [1,4] """
    return BATTERY_STATUS_MAPPING

def convert_timestamp(timestamp, time_zone):
    """ Returns pandas Timestamp object from UTC timestamp """
    ts_utc = Timestamp(timestamp, unit='s', tz='UTC')
    ts = ts_utc.astimezone(time_zone)
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

def encode_doc(doc):
    """ Converts timestamp and encodes batteryStatus and priority """
    doc["timestamp"] = convert_timestamp(doc["timestamp"], doc["timeZone"])
    doc["batteryStatus"] = encode_battery_status(doc["batteryStatus"])
    for app in doc["apps"]:
        app["priority"] = encode_priority(app["priority"])
    return doc

def expand_dict(doc):
    """ Expands nested dict into list of OrderedDicts
    Args:
        doc - dict with nested list of dicts under key "apps"
    Returns:
        expanded_doc - list of flat OrderedDicts with dataframe schema as
                       keys
    """
    expanded_docs = []
    for app in doc["apps"]:
        expanded_docs.append(OrderedDict({"uuid":          doc["uuid"],
                                          "processName":   app["processName"],
                                          "priority":      app["priority"],
                                          "timestamp":     doc["timestamp"],
                                          "batteryLevel":  doc["batteryLevel"],
                                          "batteryStatus": doc["batteryStatus"]
                                         }))
    return expanded_docs

#TODO: Implement me
def drop_unwanted(dataframe):
    """ Returns dataframe with unwanted rows/columns removed """
    # Remove rows with invalid encoding
    dataframe = dataframe[dataframe.priority != -1]
    dataframe = dataframe[dataframe.batteryStatus != -1]

    return dataframe

def get_dataframe(uuid):
    """ Returns clean dataframe with all samples for user uuid """
    # Connect to Mongo
    mongo = MongoConnection(CONNECTION_STRING, "carat", "samples")

    # Build list of encoded, expanded samples
    doc_list = []
    for sample in mongo.get_docs({"uuid": uuid}):
        expanded_sample = expand_dict(encode_doc(sample))
        doc_list.extend(expanded_sample)

    # Convert list of samples to dataframe
    df = DataFrame(doc_list)

    # Drop unwanted rows/columns
    df = drop_unwanted(df)

    return df


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

    ## Test with single example sample doc
    encoded_example = encode_doc(example_doc)
    pprint(encoded_example)

    expanded_doc = expand_dict(encoded_example)
    pprint(expanded_doc)

    df = DataFrame(expanded_doc)
    print(df)

    df = drop_unwanted(df)
    print(df)

    ## Test all
    print(get_dataframe(example_doc["uuid"]))
