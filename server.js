// server.js

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const data = [1, 2, 3, 4, 5]; // Your backend array

// Function to send data to connected clients
const sendDataToClients = () => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Emit data every second
setInterval(() => {
  // Example: Modify data dynamically (e.g., fetching from a database)
  data.push(Math.floor(Math.random() * 10));
  sendDataToClients();
}, 1000);

// WebSocket connection handler
wss.on('connection', ws => {
  console.log('Client connected');

  // Send initial data to the client upon connection
  ws.send(JSON.stringify(data));

  // Close connection handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

