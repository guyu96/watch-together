import React, { Component } from 'react';

export default class PartyBar extends Component {
  handleStartStop = () => {
    if (!this.props.changingParty) {
      const role = this.props.role;
      if (role === 'none') {
        this.props.startParty();
      } else if (role === 'host') {
        this.props.leaveParty();
      }
    }
  };

  handleJoinLeave = () => {
    if (!this.props.changingParty) {
      const role = this.props.role;
      if (role === 'none') {
        this.props.joinParty(this.partyInput.value);
      } else if (role === 'client') {
        this.props.leaveParty();
      }
      this.partyInput.value = '';
    }
  };

  render() {
    const { changingParty, role } = this.props;
    return (
      <div className="field has-addons">
        <p className="control">
          <button
            disabled={changingParty || role === 'client'}
            onClick={this.handleStartStop}
            id="start-stop-party"
            type="button"
            className="button is-info"
          >
            {role === 'host' ? 'Stop Party' : 'Start Party'}
          </button>
        </p>
        <p className="control">
          <button
            disabled={changingParty || role === 'host'}
            type="button"
            className="button is-static"
          >
            or
          </button>
        </p>
        <p className="control is-expanded">
          <input
            readOnly={changingParty || role !== 'none'}
            ref={node => {
              this.partyInput = node;
            }}
            id="party-input"
            className="input"
            type="text"
            placeholder="Party ID"
          />
        </p>
        <p className="control">
          <button
            disabled={changingParty || role === 'host'}
            id="join-quit-party"
            onClick={this.handleJoinLeave}
            type="button"
            className="button is-info"
          >
            {role === 'client' ? 'Leave Party' : 'Join Party'}
          </button>
        </p>
      </div>
    );
  }
}
