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

function assignUserColor() {
  const colorsArr = ["#136bf7", "#b213f7", "#f71313", "#00b51e"];
  const color = colorsArr[Math.floor(Math.random()*colorsArr.length)];
  return color;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  let clientsSize = {
    type: "incomingClients",
    size: wss.clients.size
  }
  broadcastToClients(clientsSize);
  //assign color
  //send color to client
  //give msg type: colorMsg
  let userColorMsg = {
    type: "colorMsg",
    color: assignUserColor()
  }
  ws.send(JSON.stringify(userColorMsg));

  ws.on('message', function(msg) {
    msg = JSON.parse(msg);
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

