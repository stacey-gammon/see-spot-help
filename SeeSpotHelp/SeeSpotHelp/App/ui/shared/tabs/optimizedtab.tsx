'use strict'

import * as React from 'react';
var ReactBootstrap = require('react-bootstrap');
var Tab = ReactBootstrap.Tab;

export default class OptimizedTab extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  getTabContent() {
    if (!this.isActive()) {
      return null;
    }
    return this.props.children
  }

  isActive() {
    return this.props.eventKey == this.props.activeKey;
  }

  render() {
    var className = this.isActive() ? 'tab active in' : 'tab';
    return (
      <Tab className={className} eventKey={this.props.eventKey} title={this.props.title}>
        {this.getTabContent()}
      </Tab>
    );
  }
}
