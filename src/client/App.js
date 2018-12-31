import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

export default class App extends Component {
  constructor() {
    super();
    this.socket = socketIOClient();
  }

  render() {
    return <h1>I am a socket.</h1>;
  }
}
