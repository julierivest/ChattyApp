import React, {Component} from 'react';

class ChatBar extends Component {
  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.currentUser} onKeyUp={this.props.setNewUsername} />
        <input className="chatbar-message" type="text" placeholder="Type a message and hit ENTER" onKeyUp={this.props.setNewMessage} />
      </footer>
    );
  }
}

export default ChatBar;


