import React, { Component } from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import './video-js-vsg-skin.css';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    // A flag that is set to true after receiving a seek to prevent infinite event loops
    this.justReceivedSeek = false;
  }

  componentDidMount() {
    this.setupPlayer({
      autoplay: false,
      controls: true,
      fluid: true
    });
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

  setupPlayer(options) {
    this.player = videojs(this.videoNode, { ...options });
    this.player.on('play', () => {
      console.log('video-play');
      // hide control bar to prevent seeking while the video plays, which triggers a lot of events
      this.player.controlBar.hide();
      if (this.props.role !== 'none' && !this.justReceivedSeek) {
        this.props.socket.emit('sync-play');
      }
    });
    this.player.on('pause', () => {
      console.log('video-pause');
      this.player.controlBar.show();
      if (this.props.role !== 'none' && !this.justReceivedSeek) {
        this.props.socket.emit('sync-pause');
      }
    });
    this.player.on('seeking', () => {
      console.log('video-seeking');
    });
    this.player.on('seeked', () => {
      console.log('video-seek');
      if (this.props.role !== 'none') {
        if (this.justReceivedSeek) {
          this.justReceivedSeek = false;
        } else {
          this.props.socket.emit('sync-seek', {
            time: this.player.currentTime()
          });
        }
      }
    });
    this.props.socket.on('sync-play', () => {
      console.log('sync-play');
      this.player.play();
    });
    this.props.socket.on('sync-pause', () => {
      console.log('sync-pause');
      this.player.pause();
    });
    this.props.socket.on('sync-seek', data => {
      console.log('sync-seek', data);
      this.justReceivedSeek = true;
      this.player.currentTime(data.time);
    });
    this.props.socket.on('sync-error', data => {
      console.error(data);
    });
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
