from flask import Flask, jsonify, request
from flask.ext.pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'productivity_data'
app.config['MONGO_URI'] = ' mongodb+srv://frontend:GZK3WsgOV9IC7NP0@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority'

mongo = PyMongo(app)

@app.route('/framework', methods=['GET'])
def get_all_frameworks():
    framework = mongo.db.framework

    output = []

    for q in framework.find():
        apps = []
	    for r in framework.find(‘apps’):
		    apps.append({'processName' : r['processName'], 'priority': r['priority']);
        output.append({'uuid': q['uuid'], 'timestamp': q['timestamp'], 'batteryLevel': q['batteryLevel'], 'batteryStatus': q['batteryStatus']})

    return jsonify({'result': output})

@app.route('/framework/<uuid>', methods=['GET'])
def get_one_framework(uuid):
    framework = mongo.db.framework

    q = framework.find_one({'uuid': uuid})

    if q:
        output = {'uuid': q['uuid'], 'processName': q['processName'], 'priority': q['priority'], 'timestamp': q['timestamp'], 'batteryLevel': q['batteryLevel'], 'batteryStatus': q['batteryStatus']}
    else:
        output = 'No results found'

    return jsonify({'result': output})


if __name__ == '__main__':
    app.run(debug=True)