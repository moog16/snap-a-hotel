import React from 'react';
import {Spinner} from 'spin.js';

export default class extends React.Component {
  spinnerEl = null;

  componentDidMount() {
    // http://spin.js.org/
    new Spinner(Object.assign({
      color: '#888',
      lines: 12,
      position: 'relative'
    }, this.props)).spin(this.spinnerEl);
  }

  render() {
    return (
      <div
        className='spinner-component'
        ref={spinnerEl => this.spinnerEl = spinnerEl}
        style={this.props.style}
      />
    );
  }
}
