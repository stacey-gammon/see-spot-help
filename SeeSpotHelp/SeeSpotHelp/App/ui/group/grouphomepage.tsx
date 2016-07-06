'use strict';

import * as React from 'react';
var Loader = require('react-loader');

import Intro from '../intro';

import GroupInfoBar from './groupinfobar';
import GroupPageTabs from './grouppagetabs';

import Utils from '../uiutils';
import Group from '../../core/databaseobjects/group';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';

import AnimalStore from '../../stores/animalstore';
import ActivityStore from '../../stores/animalactivitystore';
import ScheduleStore from '../../stores/schedulestore';
import PhotoStore from '../../stores/photostore';

import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

export default class GroupHomePage extends React.Component<any, any> {
  public mounted: boolean = false;

  constructor(props) {
    super(props);
    var groupId = Utils.FindPassedInProperty(this, 'groupId');
    if (groupId) {
      Utils.SaveProp('groupId', groupId);
    } else {
      groupId = Utils.GetProp('groupId');
    }

    this.state = {
      groupId: groupId,
      loading: true
     };
    this.onGroupChange = this.onGroupChange.bind(this);
    this.loadFromServer = this.loadFromServer.bind(this);
    this.loadDefaultGroup = this.loadDefaultGroup.bind(this);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.loadFromServer);
    this.loadFromServer();
    this.mounted = true;
  }

  componentWillUnmount() {
    PermissionsStore.removePropertyListener(this);
    LoginStore.removeChangeListener(this.loadFromServer);
    GroupStore.removeChangeListener(this.onGroupChange);
    GroupStore.removeChangeListener(this.loadDefaultGroup);
    GroupStore.removePropertyListener(this);
    this.mounted = false;
  }

  loadDefaultGroup() {
    var groupId = this.state.groupId;
    // If the user doesn't have any 'last looked at' group, see if we can grab one from the user.
    if (LoginStore.getUser() && !groupId) {
      var groups = GroupStore.getGroupsByUser(LoginStore.getUser(), this.loadDefaultGroup);
      if (groups && groups.length > 0) {
        groupId = groups[0].id;
      }
    }

    // User doesn't belong to any groups, and isn't looking at any.  We'll just show an intro
    // screen on the home page.
    if (!groupId) return;

    GroupStore.ensureItemById(groupId).then(
      function () {
        if (!this.mounted) return;

        var group = GroupStore.getGroupById(groupId);
        var permission = StoreStateHelper.GetPermission(this.state);
        if (group) {
          this.setState({ permission: permission, groupId: group.id, loading: false });
          this.removeGroupChangeListeners();
          this.addGroupChangeListeners(group);
        }
      }.bind(this)
    );
  }

  loadFromServer() {
    // If the user doesn't have any 'last looked at' group, see if we can grab one from the user.
    if (LoginStore.getUser() && !this.state.groupId) {
      GroupStore.addPropertyListener(this,
                                     'userId',
                                     LoginStore.getUser().id,
                                     this.loadDefaultGroup);
      PermissionsStore.addPropertyListener(this,
                                           'userId',
                                           LoginStore.getUser().id,
                                           this.loadDefaultGroup);
    }
    this.loadDefaultGroup();
  }

  loadDifferentGroup(group) {
    this.setState({ groupId: group.id });
  }

  removeGroupChangeListeners() {
    PermissionsStore.removePropertyListener(this);
    GroupStore.removePropertyListener(this);
  }

  addGroupChangeListeners(group) {
    if (LoginStore.getUser()) {
      PermissionsStore.addPropertyListener(this,
                                           'userId',
                                           LoginStore.getUser().id,
                                           this.onGroupChange);
    }
    GroupStore.addPropertyListener(this, 'id', group.id, this.onGroupChange);
  }
  //
  // // Download group data for the other tabs so switching tabs is very fast.
  // preDownloadData(group) {
  //   AnimalStore.getItemsByProperty('groupId', group.id);
  //   // Limit the activity to the top 20.
  //   ActivityStore.getItemsByProperty('groupId', group.id, 20);
  //   PhotoStore.getItemsByProperty('groupId', group.id);
  //   ScheduleStore.getItemsByProperty('groupId', group.id);
  // }

  onGroupChange() {
    var permission = StoreStateHelper.GetPermission(this.state);
    this.setState({ permission: permission });
  }

  hasGroupHomePage(group) {
    var permission = StoreStateHelper.GetPermission(this.state);
    return (
      <div className='page'>
        <GroupInfoBar group={group} permission={permission}/>
        <GroupPageTabs group={group} permission={permission} />
      </div>
    );
  }

  render() {
    console.log('GroupHomePage:render');

    if (this.state.loading) {
      return <Loader loaded={false} />
    }

    if (this.state.groupId) {
      var group = GroupStore.getGroupById(this.state.groupId);
      if (group) {
        return this.hasGroupHomePage(group);
      }
    }

    return ( <div> <Intro /> </div> );
  }
}
