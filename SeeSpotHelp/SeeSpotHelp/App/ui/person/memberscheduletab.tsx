"use strict";

var React = require('react');

import $ = require('jquery');
import Utils from '../uiutils';
import Animal from '../../core/databaseobjects/animal';
import Group from '../../core/databaseobjects/group';
import LoginStore from '../../stores/loginstore';
var Calendar = require("../calendar");

var GroupScheduleTab = React.createClass({
  getInitialState: function() {
    return {
      refreshCalendar: false,
    }
  },

  render: function() {
    return (
      <div>
        <Calendar view={this.props.view} memberId={this.props.memberId} group={this.props.group} />
      </div>
    );
  }
});

module.exports = GroupScheduleTab;
