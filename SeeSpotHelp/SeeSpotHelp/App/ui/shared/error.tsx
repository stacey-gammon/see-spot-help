'use strict'

import * as React from 'react';

export default class Error extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  get(errorMessage) {
    return <div className="alert alert-danger">Oops. Something went wrong.</div>
  }

  render() {
    if (!this.props.error) return null;
    if (!this.props.errorMessage) return <div className='alert alert-danger'>Oops. Something went wrong.</div>
    return <div className='alert alert-danger'>{this.props.errorMessage}</div>
  }
}
