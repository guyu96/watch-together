import React, { Component } from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import './video-js-vsg-skin.css';

export default class VideoPlayer extends Component {
  componentDidMount() {
    const videoOptions = {
      autoplay: false,
      controls: true,
      fluid: true
    };
    this.player = videojs(this.videoNode, { ...videoOptions });
    window.player = this.player;
  }

  componentDidUpdate() {
    const videoFile = this.props.videoFile;
    if (videoFile) {
      this.player.src(videoFile);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // Wrap the player in a div with a `data-vjs-player` attribute so videojs won't create additional wrapper in the DOM
  // See https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player>
        <video
          ref={node => {
            this.videoNode = node;
          }}
          className="video-js"
        />
      </div>
    );
  }
}
