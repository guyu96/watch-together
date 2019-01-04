import React, { Component } from 'react';

import FileInput from './FileInput';
import SocketIDBar from './SocketIDBar';
import PartyBar from './PartyBar';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-3">
          <FileInput updateVideoFile={this.props.updateVideoFile} />
        </div>
        <div className="column is-4">
          <SocketIDBar socketID={this.props.socketID} />
        </div>
        <div className="column is-5">
          <PartyBar
            role={this.props.role}
            hostID={this.props.hostID}
            startParty={this.props.startParty}
            joinParty={this.props.joinParty}
            leaveParty={this.props.leaveParty}
            changingParty={this.props.changingParty}
          />
        </div>
      </div>
    );
  }
}
