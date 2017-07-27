import React, {Component} from 'react';

class MsgSystem extends Component {
  render() {
    return (
      <div className="message system">
        <span className="newUserNotif">{this.props.content}</span>
      </div>
    )
  }
}

export default MsgSystem;