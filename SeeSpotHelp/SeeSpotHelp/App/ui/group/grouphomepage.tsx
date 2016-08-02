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
    console.log('GroupHomePage:constructor');
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

     this.loadGroup = this.loadGroup.bind(this);
  }

  componentDidMount() {
    console.log('GroupHomePage:componentDidMount');
    LoginStore.addChangeListener(this.loadGroup);

    this.mounted = true;
    if (!LoginStore.getUser()) { return; }

    this.loadGroup();
  }

  componentWillUnmount() {
    console.log('GroupHomePage:componentWillUnmount');
    GroupStore.removePropertyListener(this);
    PermissionsStore.removePropertyListener(this);
    LoginStore.removeChangeListener(this.loadGroup);

    this.mounted = false;
  }

  loadGroupById(groupId) : Promise<Group> {
    return GroupStore.ensureItemById(groupId)
        .then((group) => {
          if (!group) {
            let permissions = PermissionsStore.getItemsByProperty('userId',
                                                                  LoginStore.getUser().id);
            return this.loadDefaultUserGroup(permissions);
          } else {
            return group as Group;
          }
        });
  }

  loadDefaultUserGroup(permissions) : Promise<Group> {
    if (permissions.length == 0) {
      return Promise.resolve(null);
    } else {
      return GroupStore.ensureItemById(permissions[0].groupId) as Promise<Group>;
    }
  }

  loadGroup() {
    console.log('GroupHomePage:loadGroup');

    PermissionsStore.ensureItemsByProperty('userId', LoginStore.getUser().id)
      .then((permissions) => {
         if (this.state.groupId) {
           return this.loadGroupById(this.state.groupId);
         } else {
           return this.loadDefaultUserGroup(permissions);
         }
      })
      .then((group) => {
        if (group) {
          var permission = PermissionsStore.getPermission(LoginStore.getUser().id, group.id);
          this.setState({ permission: permission, groupId: group.id, loading: false });
          this.removeGroupPropertyListeners();
          this.addGroupPropertyListeners(group);
        } else {
          // Clear out the group id since it's apparently invalid.
          Utils.SaveProp('groupId', null);
          this.setState({loading: false });
        }
      });
  }

  loadDifferentGroup(group) {
    this.setState({ groupId: group.id });
  }

  removeGroupPropertyListeners() {
    PermissionsStore.removePropertyListener(this);
    GroupStore.removePropertyListener(this);
  }

  addGroupPropertyListeners(group) {
    GroupStore.addPropertyListener(this, 'id', group.id, this.forceUpdate.bind(this));
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
