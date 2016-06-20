'use strict';

import * as React from 'react';

import $ = require('jquery');
import Calendar from '../calendar';

import GroupActionsBox from '../group/groupactionsbox';

import Utils from '../uiutils';
import Animal from '../../core/databaseobjects/animal';
import Group from '../../core/databaseobjects/group';
import LoginStore from '../../stores/loginstore';

export default class AnimalScheduleTab extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { refreshCalendar: false }
  }

  componentWillReceiveProps(nextProps) {
    var props = $.extend(nextProps, {refreshCalendar : true});
    this.setState(props);
  }

  render() {
    if (!this.props.group && this.props.memberId < 0) return null;

    if (this.props.group &&
      (!LoginStore.getUser() ||
       !this.props.permission.inGroup())) {
      return (
        <div>
          <h1>Only members can view or edit a schedule.</h1>
          <GroupActionsBox
            group={this.props.group}
            permission={this.props.permission}/>
        </div>);
    }
    return (
      <div>
        <Calendar
          propToForceRefresh={this.state.refreshCalendar}
          animalId={this.props.animalId}
          memberId={this.props.memberId}
          view={this.props.view}
          group={this.props.group} />
      </div>
    );
  }
}
