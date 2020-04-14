import json
from pprint import pprint

import pymongo

import pandas as pd


user = 'read'
pwd = ''    # FIXME: replace PASSWORD before running
connectionString = f"mongodb+srv://{user}:{pwd}@cluster0-wn7hw.azure.mongodb.net/test?retryWrites=true&w=majority"
print(f"Connection String: {connectionString}")

# Connect to instance
client = pymongo.MongoClient(connectionString)


# Print databases
print(f"Databases: {client.list_database_names()}")

# Use carat db
db = client.carat
print("Using db carat")
list_collections =  db.list_collection_names()
print(f"Collections: {list_collections}")

# Re-get data
def reset_ret(ret):
    ret = db.usage.find_one()
    return ret

def get_num_rets(limit):
    spec = {"uuid": "eb20b8b2103f98d5f3418dfe461502a0fa3d82429460703569868243d25cc56c"}
    rets = db.usage.find(spec).limit(limit)
    return rets
    #you would clean each doc in rets

# Converts each app priority to numerical values
def organize_apps(ret):
    order = ['Foreground app', 'Visible task', 'Background process', 'Unknown', 'Service']
    classifications = [1, -1, 2, -1, 0]
    apps = ret['apps']
    for singele_process in apps:
        priority = singele_process['priority']
        index = order.index(priority)
        singele_process['priority'] = classifications[index]
    return ret

# Converts batteryStatus and batteryLevel to numerical values
def classify_battery(ret):
    battery_level = ret['batteryLevel']
    battery_status = ret['batteryStatus']

    if battery_status == 'charging': ret['batteryStatus'] = 1
    elif battery_status == 'discharging': ret['batteryStatus'] = 2
    elif battery_status == 'full': ret['batteryStatus'] = 3
    else: ret['batteryStatus'] = 0

    # High, medium, low
    if battery_level > 66: ret['batteryLevel'] = 2
    elif battery_level > 33: ret['batteryLevel'] = 1
    else: ret['batteryLevel'] = 0
    return ret

# Converts unix timestamp to timestamp object
def convert_timestamp(ret):
    ts = pd.Timestamp(ret['timestamp'], unit='s', tz=ret['timeZone'])
    ret['timestamp'] = ts
    return ret

# Deletes irrelevant columns
def remove_unnecessary(ret):
    del ret['mobileCountryCode']
    # del ret['timeZone']
    return ret

# Cleans single ret
def organize_single_rets(ret):
    ret = organize_apps(ret)
    ret = classify_battery(ret)
    ret = convert_timestamp(ret)
    ret = remove_unnecessary(ret)
    return ret

# Runs through an cleans all rets
def organize_all_rets(rets):
    for index in range(len(rets)):
        rets[index] = organize_single_rets(rets[index])
    return rets

# Organizing a single ret
ret = db.usage.find_one()
# print(type(ret))

ret = organize_apps(ret)
ret = classify_battery(ret)
ret = convert_timestamp(ret)
ret = remove_unnecessary(ret)
# print("Organized ret: ")
# pprint(ret)

##resets the single ret
# ret = reset_ret(ret)
# print("reset ret")
# pprint(ret)

# ##getting multple rets and organizing them
# limit = 3
# rets = get_num_rets(limit)
# rets = organize_all_rets(rets)
# # pprint(rets)

# converting to dataframe - takes one ret object at a time
def json_to_dataframe(ret):
    jsons = []
    for app in ret["apps"]: # put each item into dict object
        jsons.append({"uuid": ret["uuid"],
                      "processName": app["processName"],
                      "priority": app["priority"],
                      "timestamp": ret["timestamp"],
                      "batteryLevel": ret["batteryLevel"],
                      "batteryStatus": ret["batteryStatus"]
                      })

    dataframe = pd.DataFrame(jsons)
    return dataframe

df = json_to_dataframe(ret)
print(df)
