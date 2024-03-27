from flask import Flask, render_template
import json
import os
import time
import paho.mqtt.client as mqtt

DATA_FILE = 'data.json'
MAX_DATA_LENGTH = 20
MQTT_BROKER = '192.168.3.4'
MQTT_PORT = 1883
MQTT_TOPIC = 'test'

app = Flask(__name__, template_folder='views')

# Function to append data to JSON file
def append_data_to_json(new_data):
    data = []

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)

    data.append(new_data)

    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=2)

    print('Data appended to JSON file.')

# Function to append new data to circular array
def append_and_update(new_value, circular_array):
    circular_array.append(new_value)
    if len(circular_array) > MAX_DATA_LENGTH:
        circular_array.pop(0)

# MQTT callback function
def mqtt_on_message(client, userdata, message):
    try:
        data = json.loads(message.payload)
        print("data",data)
        data['time'] = int(time.time() * 1000)
        append_data_to_json(data)
        append_and_update(data, circular_array)
        print(f"Received message: {message.payload.decode()}")
        socketio.emit('data_update', json.dumps(circular_array))
    except Exception as e:
        print(f"Error processing message: {e}")

# MQTT setup
def mqtt_setup():
    client = mqtt.Client()
    client.on_message = mqtt_on_message
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.subscribe(MQTT_TOPIC)
    print(f"Subscribed to topic '{MQTT_TOPIC}'")
    client.loop_start()  # Start the MQTT client loop
    return client

# Initialize circular array
circular_array = []

# Route for serving the webpage
@app.route('/')
def index():
    return render_template('index.html', title='Home', message='Hello, Flask!')

# Main function
if __name__ == "__main__":
    # app.run()
    mqtt_client = mqtt_setup()
    socketio.run(app)

