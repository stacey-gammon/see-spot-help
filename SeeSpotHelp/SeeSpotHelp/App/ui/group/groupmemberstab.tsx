'use strict'

import * as React from 'react';
import MemberListItem from '../person/memberlistitem';

import Volunteer from '../../core/databaseobjects/volunteer';
import Group from '../../core/databaseobjects/group';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import VolunteerStore from '../../stores/volunteerstore';
import PermissionsStore from '../../stores/permissionsstore';

interface MemberTabProperties {
  group?: Group,
  permission?: Permission,
  manageMode?: boolean,
  activeTab?: boolean
}

export default class GroupMembersTab extends React.Component<MemberTabProperties, any> {
  constructor(props) {
    super(props);
    this.state = {loading: true, manageMode: false};
  }

  generateMember(member, permission) {
    return (
      <MemberListItem key={member.id}
        user={LoginStore.getUser()}
        manageMode={this.state.manageMode}
        member={member}
        permission={this.props.permission}
        memberPermission={permission}
        group={this.props.group}/>
    );
  }

  componentWillMount() {
    if (this.props.group.id) {
      PermissionsStore.getPermissionsByGroupId(this.props.group.id);
    }
  }

  componentDidMount() {
    if (this.props.group) {
      PermissionsStore.addPropertyListener(
        this, 'groupId', this.props.group.id, this.onChange.bind(this));
    }
  }

  shouldComponentUpdate(newProps, newState) {
    return newProps.permission != this.props.permission ||
           newProps.group != this.props.group ||
           newState.manageMode != this.state.manageMode;
  }

  componentWillUnmount() {
    PermissionsStore.removePropertyListener(this);
    VolunteerStore.removePropertyListener(this);
  }

  onChange() {
    this.forceUpdate();
  }

  addVolunteerListener(volunteerId) {
    VolunteerStore.addPropertyListener(this, 'id', volunteerId, this.onChange.bind(this));
  }

  addMemberElement(permission, members) {
    if (!permission.notInGroup()) {
      var member = VolunteerStore.getVolunteerById(permission.userId);
      if (member) {
        members.push(this.generateMember(member, permission));
      } else {
        this.addVolunteerListener(permission.userId);
      }
    }
  }

  manageMemberMode() {
    var manageMode = !this.state.manageMode;
    this.setState({manageMode: manageMode});
  }

  getManageMembersButton() {
    if (!this.props.permission.admin()) return null;
    var text = this.state.manageMode ? 'End Manage Mode' : 'Manage Members (Admin Only)';
    return (
      <div className="tiny-text text-right">
        <a className='' onClick={this.manageMemberMode.bind(this)}>
          {text}
        </a>
      </div>
    );
  }

  render() {
    if (!this.props.group) return null;
    var memberPermissions = PermissionsStore.getPermissionsByGroupId(this.props.group.id);
    if (!memberPermissions) return null;

    var members = [];
    for (var i = 0; i < memberPermissions.length; i++) {
      this.addMemberElement(memberPermissions[i], members);
    }
    return (
      <div>
        {this.getManageMembersButton()}
        <div className="list-group">
          {members}
        </div>
      </div>
    );
  }
}
