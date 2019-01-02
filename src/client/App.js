import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import VideoPlayer from './components/VideoPlayer';

export default class App extends Component {
  constructor() {
    super();
    this.socket = socketIOClient();
  }

  render() {
    const videoOptions = {
      autoplay: false,
      controls: true,
      fluid: true
    };
    return (
      <div>
        <VideoPlayer {...videoOptions} />
      </div>
    );
  }
}
