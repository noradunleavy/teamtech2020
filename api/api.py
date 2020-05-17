from flask import Flask

from mongo_connection import MongoConnection


USER = 'frontend'
SECRET = ''
URI = f'mongodb+srv://{USER}:{SECRET}@cluster0-wn7hw.azure.mongodb.net/?retryWrites=true&w=majority'

app = Flask(__name__)

mongo = MongoConnection(URI, db='carat')

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello, World!'

@app.route('/connect')
def connect():
    return f"MongoDB Database: {repr(mongo.db_name)}"

@app.route('/categories/<processName>', methods=['GET'])
def get_one_category(processName):
    response = mongo.db['categories'].find_one({'processName': processName}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'
    return

@app.route('/samples', methods=['GET'])
def get_all_samples():
    """ Returns enumerated dict of a limit of 5 documents """
    response = {}
    for num,doc in enumerate(mongo.db['samples'].find(None,{'_id':0}).limit(5)):
        response[num] = doc
    return response

@app.route('/samples/<uuid>', methods=['GET'])
def get_one_use(uuid):
    response = mongo.db['samples'].find_one({'uuid': uuid}, {'_id':0})
    if response:
        return response
    else:
        return 'No matches'
    return


if __name__ == '__main__':
    app.run(debug=True)
