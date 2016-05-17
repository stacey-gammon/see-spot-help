"use strict";

import * as React from 'react';

import Permission from "../../core/databaseobjects/permission";
import Volunteer from "../../core/databaseobjects/volunteer";
import Group from "../../core/databaseobjects/group";
import Utils from "../uiutils";
import LoginStore from "../../stores/loginstore";
import GroupStore from "../../stores/groupstore";
import PermissionsStore from "../../stores/permissionsstore";
import VolunteerStore from "../../stores/volunteerstore";

var MemberScheduleTab = require("./memberscheduletab");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var SearchPage = require("../searchpage");

import ActivityTab from '../shared/tabs/activitytab';
import UserInfoBar from './userinfobar';

import UserGroupsTab from './usergroupstab';
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

export default class MemberPage extends React.Component<any, any> {
  // Required for page transitions via this.context.router.push.
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    var member = Utils.FindPassedInProperty(this, 'member') || LoginStore.getUser();
    var groupId = Utils.FindPassedInProperty(this, 'groupId');

    this.state = {
      member: member,
      groupId: groupId
    };

    Utils.LoadOrSaveState(this.state);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
    GroupStore.addChangeListener(this.onChange);
    PermissionsStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
    GroupStore.removeChangeListener(this.onChange);
    PermissionsStore.removeChangeListener(this.onChange);
  }

  onChange() {
    var id;
    if (this.state.member) {
      id = this.state.member.id;
    } else if (LoginStore.getUser()){
      id = LoginStore.getUser().id;
    }
    this.setState(
      {
        member: VolunteerStore.getVolunteerById(id)
      });
  }

  handleTabSelect(key) {
    this.setState({memberDefaultTabKey : key});
    // We aren't supposed to manipulate state directly, but it doesn't yet have the newly
    // selected tab that we want to save to local storage.
    var stateDuplicate = this.state;
    stateDuplicate.memberDefaultTabKey = key;
    Utils.LoadOrSaveState(stateDuplicate);
  }

  render() {
    var group = GroupStore.getGroupById(this.state.groupId);
    if (!LoginStore.getUser() || !this.state.member) return null;
    var memberName = this.state.member.displayName ?
      this.state.member.displayName : this.state.member.name;
    if (this.state.member) {
      var defaultKey = this.state.memberDefaultTabKey ? this.state.memberDefaultTabKey : 1;
      return (
        <div className='page'>
          <UserInfoBar group={group} user={this.state.member}/>
          <Tabs className="tabs-area"
                activeKey={defaultKey}
                onSelect={this.handleTabSelect.bind(this)}>
            <Tab eventKey={1} title={Utils.getActivityGlyphicon()}>
              <ActivityTab property='userId'
                           value={this.state.member.id}
                           permission={Permission.CreateNonMemberPermission()}/>
            </Tab>
            <Tab eventKey={2} title={Utils.getCalendarGlyphicon()}>
              <MemberScheduleTab
                memberId={this.state.member.id}
                view="member"/>
            </Tab>
          </Tabs>
          <br/><br/>
        </div>
      );
    }
  }
}
