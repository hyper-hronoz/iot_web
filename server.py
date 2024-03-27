import csv
import json
import time

from flask import Flask, jsonify, render_template, Response
from flask_sock import Sock
from collections import deque
from datetime import datetime
import paho.mqtt.client as mqtt

from json import JSONEncoder
from collections import deque
from io import StringIO


app = Flask(__name__,  template_folder='views')
sock = Sock(app)

DATA_FILE = 'data.json'
MAX_DATA_LENGTH = 20
MQTT_BROKER = '192.168.3.4'
MQTT_PORT = 1883
MQTT_TOPIC = 'test'

def read_json():
    try:
        with open('data.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []
    return data

def append_data_to_json(new_data):
    data = read_json()

    data.append(new_data)

    with open('data.json', 'w') as file:
        json.dump(data, file, indent=2)
    print('Data appended to JSON file.')


circular_array = deque(maxlen=24)


def send_data_to_clients():
    print("Sending data")
    sock.broadcast('data', list(circular_array))


def emit_data():
    send_data_to_clients()

class DequeEncoder(JSONEncoder):
    def default(self, obj):
       if isinstance(obj, deque):
          return list(obj)
       return JSONEncoder.default(self, obj)

@app.route('/downloader')
def index():
    data=read_json()
    return render_template('index.html',  title='Analizer', message='Data analizer', data=data)

def json_to_csv(json_data):
    output = StringIO()
    csv_writer = csv.DictWriter(output, fieldnames=json_data[0].keys())
    csv_writer.writeheader()
    csv_writer.writerows(json_data)
    return output.getvalue()

@app.route('/download_csv')
def download_csv():
    data = read_json()

    csv_data = json_to_csv(data)
    
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; filename=weather_data.csv"})

@app.route("/update_table")
def update_table():
    return read_json()

@sock.route('/')
def handle_connect(ws):
    print('Client connected')
    while True:
        # data = ws.receive()
        ws.send(json.dumps(circular_array, cls=DequeEncoder))
        time.sleep(5)


@sock.route('/')
def handle_disconnect(ws):
    print('Client disconnected')


@sock.route('/')
def handle_message(ws, message):
    try:
        data = json.loads(message)
        new_data = data
        append_data_to_json(new_data)
        circular_array.append(new_data)
        print(f"Received message: {message}")
    except Exception as e:
        print(e)


# MQTT broker address and port
MQTT_BROKER = '192.168.3.4'
MQTT_PORT = 1883
MQTT_TOPIC = 'test'

temperatures = []
humidities = []


@sock.route('/')
def handle_mqtt(ws):
    try:
        print('Connected to MQTT broker')
        # Subscribe to MQTT topic
        # Note: You need to implement MQTT connection and subscription
    except Exception as e:
        print(e)

def append_and_update(new_value, circular_array):
    circular_array.append(new_value)
    if len(circular_array) > MAX_DATA_LENGTH:
        circular_array.pop(0)

def mqtt_on_message(client, userdata, message):
    try:
        data = json.loads(message.payload)
        t = time.localtime()
        data['time'] = time.strftime("%Y:%m:%d:%H:%M:%S", t)
        append_data_to_json(data)
        append_and_update(data, circular_array)
    except Exception as e:
        print(f"Error processing message: {e}")

def mqtt_setup():
    try: 
        client = mqtt.Client()
        client.on_message = mqtt_on_message
        client.connect(MQTT_BROKER, MQTT_PORT)
        client.subscribe(MQTT_TOPIC)
        print(f"Subscribed to topic '{MQTT_TOPIC}'")
        client.loop_start()  # Start the MQTT client loop
        return client
    except:
        print("Unable to connect mqtt")
        

if __name__ == '__main__':
    mqtt_client = mqtt_setup()
    app.run(debug=True, port=5000)
