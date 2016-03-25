"use strict";

var React = require('react');

var Utils = require("../../core/utils");
var Animal = require("../../core/animal");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var Calendar = require("../calendar");
var GroupActionsBox = require('../group/groupactionsbox');

var AnimalScheduleTab = React.createClass({
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
			 !this.props.group.shouldAllowUserToEdit(LoginStore.user.id))) {
			return (
				<div>
					<h1>Only members can view or edit a schedule.</h1>
					<GroupActionsBox group={this.props.group}/>
				</div>);
		}
		return (
			<div>
				{this.getLegend()}
				<Calendar
					propToForceRefresh={this.state.refreshCalendar}
					animalId={this.props.animalId}
					memberId={this.props.memberId}
					view={this.props.view}
					group={this.props.group} />
			</div>
		);
	}
});

module.exports = AnimalScheduleTab;
