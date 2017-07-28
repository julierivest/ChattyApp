import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        connectedClients: 0,
        currentUser: {name: "Anonymous", color: "black"}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
  }

  setNewMessage(e) {
    if(e.keyCode === 13) {
      let newMsg = {
        color: this.state.currentUser.color,
        type: "postMessage",
        username: this.state.currentUser.name,
        content: e.target.value,
      }
      this.socket.send(JSON.stringify(newMsg));
      e.target.value = "";
    }
  }

  setNewUsername(e) {

    if(e.keyCode === 13) {
      let oldUsername = this.state.currentUser.name;
      let newUser = {
        type: "postNotification",
        content: `${oldUsername} has changed their name to ${e.target.value}`
      }
      this.socket.send(JSON.stringify(newUser));
      this.state.currentUser.name = e.target.value;
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onopen = function() {
      console.log("Client connected");
    }
    this.socket.onmessage = (broadcastedMsg) => {
      let input = JSON.parse(broadcastedMsg.data);
      switch (input.type) {
        case "colorMsg":
        this.setState({currentUser: {name: this.state.currentUser.name, color: input.color}});
        break;
        //make case for colorMsg
        //setStae color
        //pass to msg list
        case "incomingClients":
          this.setState({connectedClients: input.size});
          break;
        case "incomingMsg":
          let msgs = this.state.messages.concat(input);
          this.setState({messages: msgs});
          break;
        case "incomingNotif":
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
        <NavBar clients={this.state.connectedClients} />
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser.name} setNewMessage={this.setNewMessage.bind(this)} setNewUsername={this.setNewUsername.bind(this)} clients={this.state.connectedClients} />
      </div>
    );
  }
}

export default App;



