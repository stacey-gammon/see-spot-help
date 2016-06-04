'use strict'

import * as React from 'react';
import Error from '../shared/error';

export default class LeaveGroupButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    }
  }

  leaveGroup(event) {
    if (confirm("Are you sure you want to leave the group?")) {
      this.props.permission.leave();
      this.props.permission.update().catch(function(error) {
        this.setState({error: error});
      }.bind(this));
    }
  }

  render() {
    // TODO: will have to let admins leave at some point.
    if (!this.props.permission || !this.props.permission.member()) {
      return null;
    }
    return (
      <div>
        <Error error={this.state.error} makeModal="true"/>
        <a className="leave-group-link"
           ref="leaveGroupButton"
           onClick={this.leaveGroup.bind(this)}>
          Leave Group
        </a>
      </div>
    );
  }
}
