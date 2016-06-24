'use strict'

import * as React from 'react';

import LoginStore from '../../stores/loginstore';
import Permission from '../../core/databaseobjects/permission';

class GroupInfoBox extends React.Component<any, any> {
  context = { router: null }; // Just to keep Typescript happy.
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
  }

  editGroup() {
    this.context.router.push(
      {
        pathname: "/addNewGroup",
        state: {
          groupId:  this.props.group.id,
          mode: 'edit'
        }
      });
  }

  getEditButton() {
    if (!LoginStore.getUser() ||
      !this.props.permission||
      !this.props.permission.admin()) {
      return null;
    }
    return (
      <span className='edit-group-button glyphicon glyphicon-edit' onClick={this.editGroup.bind(this)}>
      </span>
    );
  }

  render() {
    return (
      <div className="shelterInfoBox">
          {this.getEditButton()}
        <h1>{this.props.group.name}</h1>
        <h2>{this.props.group.shelter}</h2>
        <h2>{this.props.group.address}</h2>
        <h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
      </div>
    );
  }
}

export default GroupInfoBox;
