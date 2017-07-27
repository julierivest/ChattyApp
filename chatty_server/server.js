// server.js
const WebSocket = require('ws');
const express = require('express');
const SocketServer = require('ws').Server;
// Used to generate random ID for each broadcast
const uuid = require('node-uuid');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

function broadcastToClients(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  })
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(wss.clients.size);
  let clientsSize = {
    type: "incomingClients",
    size: wss.clients.size
  }
  broadcastToClients(clientsSize);

  ws.on('message', function(msg) {
    console.log("received message" + msg);

    msg = JSON.parse(msg);
console.log("msg type server " + msg.type);

    switch (msg.type) {

      case "postMessage":
        msg["id"] = uuid.v4();
        msg["type"] = "incomingMsg"
        console.log(msg);
        broadcastToClients(msg);
        break;
      case "postNotification":
        console.log("before modif" + msg);
        msg["id"] = uuid.v4();
        msg["type"] = "incomingNotif";
        console.log("after" + JSON.stringify(msg));

        broadcastToClients(msg);
        break;
      default:
        throw new Error("Unknown event type SERVER");
    }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
  let clientsSize = {
    type: "incomingClients",
    size: wss.clients.size
  }
  broadcastToClients(clientsSize);
  });

});

