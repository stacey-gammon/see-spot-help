'use strict';

import * as React from 'react';
var ReactBootstrap = require('react-bootstrap');
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

import UserGroupsTab from './usergroupstab';
import ActivityTab from '../shared/tabs/activitytab';
import OptimizedTab from '../shared/tabs/optimizedtab';
var MemberScheduleTab = require('./memberscheduletab');

import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';
import Permission from '../../core/databaseobjects/permission';

export default class ProfilePageTabs extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { profileDefaultTabKey: null };
    Utils.LoadOrSaveState(this.state);
  }

  handleTabSelect(key) {
    this.setState({profileDefaultTabKey : key});
    // We aren't supposed to manipulate state directly, but it doesn't yet have the newly
    // selected tab that we want to save to local storage.
    var stateDuplicate = this.state;
    stateDuplicate.profileDefaultTabKey = key;
    Utils.LoadOrSaveState(stateDuplicate);
  }

  render() {
    var defaultKey = this.state.profileDefaultTabKey ? this.state.profileDefaultTabKey : 1;
    return (
      <Tabs className='tabs-area' animation={false} activeKey={defaultKey} onSelect={this.handleTabSelect.bind(this)}>
        <OptimizedTab eventKey={1} title={Utils.getGroupGlyphicon()} activeKey={defaultKey}>
          <UserGroupsTab user={this.props.user}/>
        </OptimizedTab>
        <OptimizedTab eventKey={2} title={Utils.getActivityGlyphicon()} activeKey={defaultKey}>
          <ActivityTab property='userId'
                       value={this.props.user.id}
                       permission={Permission.CreateNonMemberPermission()} />
        </OptimizedTab>
        <OptimizedTab eventKey={3} title={Utils.getCalendarGlyphicon()} activeKey={defaultKey}>
          <MemberScheduleTab view='profile' user={this.props.user}/>
        </OptimizedTab>
      </Tabs>
    );
  }
}
