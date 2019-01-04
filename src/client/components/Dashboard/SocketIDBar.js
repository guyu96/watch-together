import React, { Component } from 'react';

export default class SocketIDBar extends Component {
  constructor(props) {
    super(props);
    this.copyTimeout = 1000;
    this.state = {
      copied: false
    };
  }

  copySocketID = event => {
    this.input.select();
    document.execCommand('copy');
    event.target.focus();
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), this.copyTimeout);
  };

  render() {
    return (
      <div className="field has-addons">
        <p className="control">
          <button type="button" className="button is-static">
            My ID
          </button>
        </p>
        <p className="control is-expanded">
          <input
            ref={input => {
              this.input = input;
            }}
            className="input"
            type="text"
            value={this.props.socketID}
            readOnly
          />
        </p>
        <p className="control">
          <button
            type="button"
            className="button is-info"
            onClick={this.copySocketID}
          >
            {this.state.copied ? 'Copied' : 'Copy'}
          </button>
        </p>
      </div>
    );
  }
}
