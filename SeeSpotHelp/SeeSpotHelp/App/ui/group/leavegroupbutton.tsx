'use strict'

import * as React from 'react';

export default class LeaveGroupButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  leaveGroup(event) {
    if (confirm("Are you sure you want to leave the group?")) {
      this.props.permission.leave();
      this.props.permission.update();
    }
  }

  render() {
    // TODO: will have to let admins leave at some point.
    if (!this.props.permission || !this.props.permission.member()) {
      return null;
    }
    return (
      <a className="leave-group-link"
          ref="leaveGroupButton"
          onClick={this.leaveGroup.bind(this)}>
        Leave Group
      </a>
    );
  }
}
