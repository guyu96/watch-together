import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import NavBar from './components/NavBar/NavBar';
import PartyDisplay from './components/PartyDisplay/PartyDisplay';
import DashBoard from './components/Dashboard/Dashboard';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketID: 'Connecting...',
      role: 'none',
      hostID: '',
      clients: [],
      changingParty: false,
      videoFile: null,
      resync: false
    };
    this.setupSocket();
  }

  setupSocket() {
    this.socket = socketIOClient();
    this.socket.on('connect', () => {
      const id = this.socket.id;
      this.setState({ socketID: id, hostID: id });
    });
    this.socket.on('start-success', () => {
      console.log('start-success');
      this.setState({
        role: 'host',
        hostID: this.socket.id,
        clients: [],
        changingParty: false
      });
    });
    this.socket.on('join-success', data => {
      console.log('join-success', data);
      this.setState({
        role: 'client',
        hostID: data['party-host-id'],
        clients: data['party-clients'],
        changingParty: false
      });
    });
    this.socket.on('leave-success', () => {
      console.log('leave-success');
      this.setState({
        role: 'none',
        hostID: '',
        clients: [],
        changingParty: false
      });
    });
    this.socket.on('start-error', data => {
      console.error('start-error', data);
      this.setState({ changingParty: false });
    });
    this.socket.on('join-error', data => {
      console.error('join-error', data);
      this.setState({ changingParty: false });
    });
    this.socket.on('leave-error', data => {
      console.error('leave-error', data);
      this.setState({ changingParty: false });
    });
    this.socket.on('member-joins', data => {
      console.log('member-joins', data);
      if (this.state.role === 'host') {
        // Host triggers resync in VideoPlayer when a new member joins
        this.setState({ resync: true });
      }
      this.setState(prevState => ({
        clients: [...prevState.clients, data.id],
        resync: false // Reset resync to false after potential resync in VideoPlayer
      }));
    });
    this.socket.on('member-leaves', data => {
      console.log('member-leaves', data);
      this.setState(prevState => ({
        clients: prevState.clients.filter(id => id !== data.id)
      }));
    });
    this.socket.on('new-host', data => {
      console.log('new-host', data);
      const newHostID = data.id;
      this.setState({ role: this.socket.id === newHostID ? 'host' : 'client' });
      this.setState(prevState => ({
        hostID: newHostID,
        clients: prevState.clients.filter(id => id !== newHostID)
      }));
    });
  }

  startParty = () => {
    this.setState({ changingParty: true }, () => {
      this.socket.emit('start-party');
    });
  };

  joinParty = partyID => {
    this.setState({ changingParty: true }, () => {
      this.socket.emit('join-party', { 'party-id': partyID });
    });
  };

  leaveParty = () => {
    this.setState({ changingParty: true }, () => {
      this.socket.emit('leave-party');
    });
  };

  updateVideoFile = (type, src) => {
    this.setState({ videoFile: { type, src } });
  };

  render() {
    return (
      <div>
        <NavBar />
        <div
          className="columns"
          style={{ marginLeft: '1rem', marginRight: '1rem' }}
        >
          <div className="column is-3">
            <PartyDisplay
              socketID={this.state.socketID}
              role={this.state.role}
              hostID={this.state.hostID}
              clients={this.state.clients}
            />
          </div>
          <div className="column is-9">
            <DashBoard
              socketID={this.state.socketID}
              role={this.state.role}
              hostID={this.state.hostID}
              changingParty={this.state.changingParty}
              updateVideoFile={this.updateVideoFile}
              startParty={this.startParty}
              joinParty={this.joinParty}
              leaveParty={this.leaveParty}
            />
            <VideoPlayer
              role={this.state.role}
              socket={this.socket}
              videoFile={this.state.videoFile}
              resync={this.state.resync}
            />
          </div>
        </div>
      </div>
    );
  }
}
