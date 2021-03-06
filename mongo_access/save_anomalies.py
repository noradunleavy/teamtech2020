"""
save_anomalies.py

Module to take the dataframe of anomalies output by the ML algorithm and save
them to MongoDB.

Author(s):  Samantha Walter <sjw2@illinois.edu>
            Ankitha Damisetty <ankithad@illinois.edu>
            Shreyah Prasad <sprasa20@illinois.edu>
"""

# from pprint import pprint
from os import getenv

import numpy as np
from dotenv import load_dotenv
from pandas import DataFrame, Timestamp
from pymongo import MongoClient

# Get MongoDB credentials
load_dotenv()
USER = "algo_out"
SECRET = getenv(f"{USER.upper()}_SECRET")
if not SECRET:
    raise SystemExit(f"ERROR: Unable to retrieve MongoDB secret for user {USER}")
CONNECTION_STRING = f"mongodb+srv://{USER}:{SECRET}@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority"

def get_dummy_dataframe(uuid):
    """ Returns sample output dataframe from ML algorithm for testing """
    data = np.array([
                        [
                            Timestamp(year=2020, month=5, day=21, hour=15),
                            Timestamp(year=2020, month=5, day=21, hour=16),
                            Timestamp(year=2020, month=5, day=22, hour=14, minute=22)
                        ],
                        ['PRODUCTIVITY', 'SOCIALMEDIA', 'WEATHER'],
                        [-1, 1, -1]
                    ])
    data = data.T
    df = DataFrame(data, columns=['Timestamp', 'Category', 'Type'])
    return df

def get_anomalies(uuid, output_df):
    """ Returns dictionary with uuid and anomaly list """
    anom_lst = output_df.to_dict(orient='records')
    anom = {
        'uuid': uuid,
        'anomalies': anom_lst
    }
    # pprint(anom)
    return anom

def save_to_mongo(document):
    """ Opens connection to Mongo and inserts one document into the anomalies collection """
    mongo = MongoClient(CONNECTION_STRING)
    mongo['carat']['anomalies'].insert_one(document)

def save_anomalies_to_mongo(uuid, output_df):
    """ Creates document from ML output dataframe and saves in to the anomalies collection in Mongo """
    anom_dict = get_anomalies(uuid, output_df)
    save_to_mongo(anom_dict)

if __name__ == "__main__":
    uuid = "5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe"
    output_df = get_dummy_dataframe(uuid)

    # save_anomalies_to_mongo(uuid, output_df)

    anom_dict = get_anomalies(uuid, output_df)
    print(anom_dict)
