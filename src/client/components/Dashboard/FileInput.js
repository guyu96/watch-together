import React, { Component } from 'react';

export default class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: ''
    };
  }

  handleChange = event => {
    const file = event.target.files[0];
    this.setState({ filename: file.name });
    this.props.updateVideoFile(file.type, URL.createObjectURL(file));
  };

  render() {
    return (
      <div className="field">
        <div className="file is-info has-name is-fullwidth">
          <label htmlFor="video-file" className="file-label">
            <input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={this.handleChange}
              className="file-input"
              name="file-input"
            />
            <span className="file-cta">
              <span className="file-label">Select Video</span>
            </span>
            <span className="file-name">{this.state.filename}</span>
          </label>
        </div>
      </div>
    );
  }
}
