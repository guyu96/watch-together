import React, { Component } from 'react';

export default class VideoFileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: ''
    };
  }

  handleChange = event => {
    const file = event.target.files[0];
    this.setState({ filename: file.name });
    this.props.handleChange(file.type, URL.createObjectURL(file));
  };

  render() {
    return (
      <div className="field">
        <div className="file is-primary has-name is-fullwidth">
          <label className="file-label">
            <input
              type="file"
              accept="video/*"
              onChange={this.handleChange}
              className="file-input"
              name="file-input"
            />
            <span className="file-cta">
              <span className="file-label">Select Video File</span>
            </span>
            <span className="file-name">{this.state.filename}</span>
          </label>
        </div>
      </div>
    );
  }
}
