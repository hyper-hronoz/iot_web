// server.js

const WebSocket = require('ws');

const fs = require('fs'); // For Node.js environment

const express = require("express")

const app = express();

app.get("/all", (req, res) => {
    let jsonData = fs.readFileSync('data.json');
    data = JSON.parse(jsonData);
    res.send(data);
})

function appendDataToJson(newData) {
    let data = [];
    
    // Check if the JSON file exists
    if (fs.existsSync('data.json')) {
        // Read existing JSON data
        let jsonData = fs.readFileSync('data.json');
        
        // Parse JSON data into a JavaScript object
        data = JSON.parse(jsonData);
    }

    // Append new data to the JavaScript object
    data.push(newData);

    // Convert the JavaScript object back to JSON
    let updatedJsonData = JSON.stringify(data, null, 2);

    // Write the updated JSON data to the file
    fs.writeFileSync('data.json', updatedJsonData);

    console.log('Data appended to JSON file.');
}



const wss = new WebSocket.Server({ port: 8080 });

let circularArray = new Array(20).fill(null);

// Function to send data to connected clients
const sendDataToClients = () => {
  console.log("Sending data")
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log(circularArray)
      client.send(JSON.stringify(circularArray));
    }
  });
};

// Emit data every second
setInterval(() => {
  // Example: Modify data dynamically (e.g., fetching from a database)
  sendDataToClients();
}, 1000);

// WebSocket connection handler
wss.on('connection', ws => {
  console.log('Client connected');

  // Send initial data to the client upon connection
  ws.send(JSON.stringify(circularArray));

  // Close connection handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const mqtt = require('mqtt');

// MQTT broker address and port
const MQTT_BROKER = '192.168.3.4';
const MQTT_PORT = 1883;

const MQTT_TOPIC = 'test';

const client = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`);

const temperatures = [];
const humidities = []


// Function to append a new element to the array, removing the first element if full
function appendAndUpdate(newValue) {
    circularArray.push(newValue); // Append new value to the end
    if (circularArray.length > 20) {
        circularArray.shift(); // Remove the first element if the array is full
    }
}

client.on('message', function(topic, message) {
    try {
        let data = JSON.parse(message.toString())
        let new_data = data;
        new_data["time"] = new Date().getTime() 
        // appendDataToJson(new_data);
        appendAndUpdate(data);
        
        console.log(`Received message: ${message.toString()}`);
    } catch (e) {
        console.error(e)
    }
});

client.on('connect', function() {
    try {
        console.log('Connected to MQTT broker');
        client.subscribe(MQTT_TOPIC, function(err) {
            if (err) {
                console.error('Error subscribing to topic:', err);
            } else {
                console.log(`Subscribed to topic '${MQTT_TOPIC}'`);
            }
        });
    } catch (e) {
        console.error(e)
    }
});

client.on('error', function(err) {
    console.error('Error:', err);
});
