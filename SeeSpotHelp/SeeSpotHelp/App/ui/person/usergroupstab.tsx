'use strict'

import * as React from 'react';
var Link = require("react-router").Link;
var Loader = require('react-loader');

import Intro from '../intro';
import GroupListItem from '../group/grouplistitem';

import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import PermissionsStore from '../../stores/permissionsstore';

export default class UserGroupsTab extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onChange.bind(this));
    PermissionsStore.addPropertyListener(
        this, 'userId', this.props.user.id, this.onChange.bind(this));
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange.bind(this));
    GroupStore.removePropertyListener(this);
    PermissionsStore.removePropertyListener(this);
  }

  getGroupElement(group) {
    return (
      <GroupListItem key={group.id} group={group}/>
    );
  }

  getSearchOrAddText() {
    if (this.props.user.id != LoginStore.getUser().id) return null;
    return (
      <div className="text-center">
        <p>
          <Link to="searchPage">Search for a group</Link>&nbsp;|&nbsp;
          <Link to="addNewGroup">Add a new group</Link>
        </p>
      </div>
    );
  }

  getGroup(groupId) {
    GroupStore.addPropertyListener(
        this, 'id', groupId, this.onChange.bind(this));
    return GroupStore.getGroupById(groupId);
  }

  onChange() {
    this.setState(this.getState());
  }

  getState() {
    var groups = [];
    var permissions = PermissionsStore.getPermissionsByUserId(this.props.user.id);
    var loading = PermissionsStore.areItemsDownloading('userId', this.props.user.id);

    for (var i = 0; i < permissions.length; i++) {
      if (permissions[i].inGroup() || permissions[i].pending()) {
        var group = this.getGroup(permissions[i].groupId);
        if (group) {
          if (!group.isArchived()) { groups.push(group); }
        } else {
          loading = true;
        }
      }
    }

    return {groups: groups, loading: loading};
  }

  getGroupElements() {
    if (!this.state.groups) return null;
    if (this.state.groups.length == 0 && this.props.user.id != LoginStore.getUser().id) {
      return (
        <div>This user does not currently belong to any groups.</div>
      );
    }

    if (!this.state.groups.length) {
      return ( <Intro /> );
    }

    if (this.state.groups.length) {
      var groupElements = this.state.groups.map(this.getGroupElement);
      return (
        <div className="text-center groupList">
          {groupElements}
          <div>
            {this.getSearchOrAddText()}
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <Loader loaded={!this.state.loading} color="rgba(0,0,0,0.2)">
        {this.getGroupElements()}
      </Loader>
    );
  }
}
