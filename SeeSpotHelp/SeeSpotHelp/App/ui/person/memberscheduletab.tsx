"use strict";

var React = require('react');

import $ = require('jquery');
import Utils from '../../core/utils';
import Animal from '../../core/animal';
import VolunteerGroup from '../../core/volunteergroup';
import LoginStore from '../../stores/loginstore';
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
		return (
			<div>
				{this.getLegend()}
				<Calendar
					propToForceRefresh={this.state.refreshCalendar}
					view={this.props.view}
					memberId={this.props.memberId}
					group={this.props.group} />
			</div>
		);
	}
});

module.exports = GroupScheduleTab;
