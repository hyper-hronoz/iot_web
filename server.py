from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import json
import os

app = Flask(__name__)
socketio = SocketIO(app)

DATA_FILE = 'data.json'
MAX_DATA_LENGTH = 20

circularArray = [None] * MAX_DATA_LENGTH

def append_data_to_json(new_data):
    data = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
    
    data.append(new_data)

    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=2)
    
    print('Data appended to JSON file.')

@app.route('/all')
def get_all_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    else:
        return jsonify([])

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('initial_data', circularArray)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

def append_and_update(new_value):
    circularArray.append(new_value)
    if len(circularArray) > MAX_DATA_LENGTH:
        circularArray.pop(0)

@socketio.on('message')
def handle_message(message):
    try:
        data = json.loads(message)
        new_data = data
        new_data["time"] = int(time.time() * 1000)
        append_data_to_json(new_data)
        append_and_update(data)
        print(f'Received message: {message}')
    except Exception as e:
        print(e)

if __name__ == '__main__':
    socketio.run(app, debug=True)

