"use strict";

var React = require('react');

import $ = require('jquery');
var Utils = require("../../core/utils");
import Animal = require("../../core/animal");
import VolunteerGroup = require("../../core/volunteergroup");
import LoginStore = require("../../stores/loginstore");
var Calendar = require("../calendar");
var GroupActionsBox = require('../group/groupactionsbox');

var GroupScheduleTab = React.createClass({
	getInitialState: function() {
		return {
			refreshCalendar: false,
		}
	},

	getLegend: function() {
		return (<h1>Legend:</h1>);
	},

	componentWillReceiveProps: function(nextProps) {
		var props = $.extend(nextProps, {refreshCalendar : true});
		this.setState(props);
	},

	render: function() {
		if (!this.props.group && this.props.memberId < 0) return null;

		if (this.props.group &&
			(!LoginStore.getUser() ||
			 !this.props.permission.inGroup())) {
			return (
				<div>
					<h1>Only members can view or edit a schedule.</h1>
				</div>);
		}
		return (
			<div>
				{this.getLegend()}
				<Calendar
					propToForceRefresh={this.state.refreshCalendar}
					view='group'
					group={this.props.group} />
			</div>
		);
	}
});

module.exports = GroupScheduleTab;
