import React, {Component} from 'react';
import Message from './Message.jsx';
import MsgSystem from './MsgSystem.jsx';

class MessageList extends Component {
  render() {
    const messages = this.props.messages;
    return (
      <main className="messages">
        {messages.map((message) => {
          if (message.type === "incomingMsg") {
            return <Message key={message.id} username={message.username} content={message.content} color={message.color} />
          }
          else if (message.type === "incomingNotif") {
            return <MsgSystem key={message.id} content={message.content} />
          }
        })}
      </main>
      )
  }
}

export default MessageList;

