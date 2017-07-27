import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
  }

  setNewMessage(e) {
    if(e.keyCode === 13) {
      let newMsg = {
        type: "postMessage",
        username: this.state.currentUser.name,
        content: e.target.value,
      }
      this.socket.send(JSON.stringify(newMsg));

      e.target.value = "";
    }
  }

  setNewUsername(e) {
    console.log("gyujvb");
    if(e.keyCode === 13) {
      console.log(this.state.currentUser.name);
      let oldUsername = this.state.currentUser.name;
      console.log("old " + oldUsername);
      let newUser = {
        type: "postNotification",
        content: `${oldUsername} has changed their name to ${e.target.value}`
      }
      console.log(newUser.type);
      console.log("NU: " + newUser);
      this.socket.send(JSON.stringify(newUser));

      this.state.currentUser.name = e.target.value;
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onopen = function() {
      console.log("Client connected 2 server");
    }
    this.socket.onmessage = (broadcastedMsg) => {
      console.log(broadcastedMsg);
      let input = JSON.parse(broadcastedMsg.data);
      console.log("input: " + input);
      switch (input.type) {

        case "incomingMsg":
          console.log("input msg: " + input);
          let msgs = this.state.messages.concat(input);
          this.setState({messages: msgs});

          break;
        case "incomingNotif":
          console.log("input notif: " + input)
          let notifs = this.state.messages.concat(input);
          this.setState({messages: notifs});
          break;
        default:
          throw new Error("Unknown event type");
      }
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser.name} setNewMessage={this.setNewMessage.bind(this)} setNewUsername={this.setNewUsername.bind(this)} />
      </div>
    );
  }
}

export default App;



//event handler to ENTER on username input field
//in func, build a notification message
//notif changed name to ----
//set current username to new name
//send notif to server (the new username = data) --> server broadcasts
//when client receive notification, update the state

