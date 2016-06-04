'use strict'

import * as React from 'react';

export default class Error extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  get(errorMessage) {
    return <div className="alert alert-danger">Oops. Something went wrong.</div>
  }

  componentDidMount() {
    if (this.props.error && this.props.makeModal) {
      $('#errMessage').dialog();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error && newProps.makeModal) {
      $('#errMessage').dialog();
    }
  }

  render() {
    if (!this.props.error) return null;
    var className = 'alert alert-danger';
    if (!this.props.errorMessage) {
      return <div id="errMessage" className={className}>Oops. Something went wrong.</div>
    }

    return <div id="errMessage" className={className}>{this.props.errorMessage}</div>
  }
}
