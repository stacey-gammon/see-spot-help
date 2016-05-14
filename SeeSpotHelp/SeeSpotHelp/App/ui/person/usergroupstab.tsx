'use strict'

import * as React from 'react';
var Link = require("react-router").Link;

import Intro from '../intro';
import GroupListItem from '../group/grouplistitem';

import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import PermissionsStore from '../../stores/permissionsstore';

var UserGroupsTab = React.createClass({
  getInitialState: function () {
    var user = Utils.FindPassedInProperty(this, 'user') || LoginStore.getUser();
    return { user: user }
  },

  onChange: function () {
    var user;
    if (!this.state.user) {
      user = LoginStore.getUser()
    } else {
      user = VolunteerStore.getVolunteerById(this.state.user.id);
      user = user ? user : this.state.user;
    }
    this.setState({ user: user });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({ user: nextProps.user });
  },

  componentDidMount: function () {
    LoginStore.addChangeListener(this.onChange);
    GroupStore.addChangeListener(this.onChange);
    VolunteerStore.addChangeListener(this.onChange);
    PermissionsStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function () {
    LoginStore.removeChangeListener(this.onChange);
    GroupStore.removeChangeListener(this.onChange);
    VolunteerStore.removeChangeListener(this.onChange);
    PermissionsStore.removeChangeListener(this.onChange);
  },

  getGroupElement: function(group) {
    return (
      <GroupListItem key={group.id} group={group}/>
    );
  },

  getSearchOrAddText: function() {
    if (!this.state.user) return null;
    if (this.state.user.id != LoginStore.getUser().id) return null;
    return (
      <div className="text-center">
        <p>
          <Link to="searchPage">Search for a group</Link>&nbsp;|&nbsp;
          <Link to="addNewGroup">Add a new group</Link>
        </p>
      </div>
    );
  },

  getGroupsForUser: function () {
    var groups = [];
    var permissions = PermissionsStore.getPermissionsByUserId(this.state.user.id);
    for (var i = 0; i < permissions.length; i++) {
      if (permissions[i].inGroup()) {
        var group = GroupStore.getGroupById(permissions[i].groupId);
        if (group) groups.push(group);
      }
    }
    return groups;
  },

  getGroupElements: function() {
    if (!this.state.user) return null;
    var groups = this.getGroupsForUser();
    if (groups.length == 0 && this.state.user.id != LoginStore.getUser().id) {
      return (
        <div>This user does not currently belong to any groups.</div>
      );
    }

    if (!groups.length) {
      return ( <Intro /> );
    }

    if (groups.length) {
      var groupElements = groups.map(this.getGroupElement);
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
  },

  render: function () {
    return (
      <div> {this.getGroupElements()} </div>
    );
  }
});

module.exports = UserGroupsTab;
