import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <h3 className="clients-count">Online users: {this.props.clients}</h3>
      </nav>
    )
  }
}

export default NavBar;

