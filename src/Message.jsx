import React, {Component} from 'react';

class Message extends Component {
  render() {
    const clientStyle = {
          color: this.props.color
        }
    return (
      <div className="message">
        <span className="message-username" style={clientStyle}>{this.props.username}</span>
        <span className="message-content">{this.props.content}</span>
      </div>
    );
  }
}

export default Message;