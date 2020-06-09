"""
api.py

Flask API designed to fetch data needed for web visualizations from MongoDB.

Author(s):  Samantha Walter <sjw2@illinois.edu>
            Alycia Bhargava <alyciab2@illinois.edu>
            Niharika Dangarwala <ndanga2@illinois.edu>
"""

import datetime
from functools import wraps
from os import getenv
from time import time

import jwt
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient

# Get MongoDB credentials
load_dotenv()
USER = "frontend"
SECRET = getenv(f"{USER.upper()}_SECRET")
if not SECRET:
    raise SystemExit(f"ERROR: Unable to retrieve MongoDB secret for user {USER}")
CONNECTION_STRING = f"mongodb+srv://{USER}:{SECRET}@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority"

# Connect to MongoDB
mongo_db = MongoClient(CONNECTION_STRING)['carat']

# Start Flask app
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = getenv("API_SECRET")
if not app.config['SECRET_KEY']:
    raise SystemExit(f"ERROR: Unable to retrieve API secret")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(' ')[1]
            if auth_token:
                try:
                    jwt.decode(auth_token, app.config['SECRET_KEY'])
                    return f(*args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return forbidden(403, 'Signature expired. Please authenticate again.')
                except jwt.InvalidTokenError:
                    return forbidden(403, 'Invalid token. Please authenticate again.')
        return forbidden(403, 'Please provide a valid authentication token.')
    return decorated

def generate_auth_token(username):
    """ Generates authentication token """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
            'iat': datetime.datetime.utcnow(),
            'user': username
        }
        return jwt.encode(
            payload,
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        return e

@app.errorhandler(400)
def bad_request(status_code=400, message=''):
    return '<h1>400 Bad Request</h1><p>'+message+'</p>', 400

@app.errorhandler(403)
def forbidden(status_code, message='You do not have permission to access this resource.'):
    return '<h1>403 Forbidden</h1><p>'+message+'</p>', 403

@app.route('/', methods=['GET'])
def home():
    return '''
<html>
    <head>
        <title>SWE Illinois Team Tech API</title>
    </head>
    <body>
        <h1>Hello, World!</h1>
        <p>Welcome to SWE Illinois Team Tech's API</p>
    </body>
</html>'''

@app.route('/categories', methods=['GET'])
@token_required
def get_categories():
    """ Returns enumerated dict of all distinct categories """
    response = {}
    for num,doc in enumerate(mongo_db['categories'].distinct('categoryName')):
        response[num] = doc
    return response

@app.route('/categories/<processName>', methods=['GET'])
@token_required
def get_category(processName):
    """ Returns dict with keys processName and categoryName or 'No matches' """
    response = mongo_db['categories'].find_one({'processName': processName}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'
    return

@app.route('/samples', methods=['GET'])
@token_required
def get_all_samples():
    """ Returns enumerated dict of a limit of 5 documents """
    response = {}
    for num,doc in enumerate(mongo_db['samples'].find(None,{'_id':0}).limit(5)):
        response[num] = doc
    return response

@app.route('/samples/<uuid>', methods=['GET'])
@token_required
def get_one_sample(uuid):
    """ Returns dict of sample or 'No matches' """
    response = mongo_db['samples'].find_one({'uuid': uuid}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'

@app.route('/users', methods=['GET'])
@token_required
def get_users():
    """ Returns enumerated dict of all distinct usernames """
    response = {}
    for num,doc in enumerate(mongo_db['users'].distinct('username')):
        response[num] = doc
    return response

@app.route('/users/<username>', methods=['GET'])
def get_uuid(username):
    """ Return dict with keys username and uuid or 'No matches' """
    response = mongo_db['users'].find_one({'username': username}, {'_id':0})
    if response:
        token = generate_auth_token(username)
        response["token"] = token.decode('UTF-8')
        return response
    else:
        return 'No matches'
    return

@app.route('/anomalies/<uuid>')
@token_required
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

@app.route('/sunburst-data/<uuid>')
@token_required
def get_sunburst_data(uuid):
    """
    Returns a single document of sunburst content for a given uuid. If query
    results are empty, returns 'No matches'.
    Takes optional query parameters start and end as UNIX timestamps to limit
    query range. If no timestamps are given, results between timestamp 0 and
    the current time are returned.
    Example: /sunburst-data/5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe?start=1512468142&end=1512512500
    """
    # Get query arguments
    start_timestamp = request.args.get('start')
    end_timestamp = request.args.get('end')

    # Get MongoDB aggregation pipeline
    pipeline = get_sunburst_pipeline(uuid, start_timestamp, end_timestamp)
    mongo_cursor = mongo_db['samples'].aggregate(pipeline)
    response_lst = list(mongo_cursor)

    if response_lst:
        response = response_lst[0]

        # Replace null category with name UNCATEGORIZED
        for category in response['children']:
            if not category['name']:
                category['name'] = 'UNCATEGORIZED'

        return response
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
    start_datetime = datetime.datetime.fromtimestamp(int(start_timestamp))
    end_datetime = datetime.datetime.fromtimestamp(int(end_timestamp))

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
