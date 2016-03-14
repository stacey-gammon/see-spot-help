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

	componentWillReceiveProps: function() {
		this.setState({refreshCalendar: true});
	},

	render: function() {
		if (!this.props.group) return null;
		if (!LoginStore.getUser() ||
			!this.props.group.shouldAllowUserToEdit(LoginStore.user.id)) {
			return (
				<div>
					<h1>Only members can view or edit a schedule.</h1>
					<GroupActionsBox group={this.props.group}/>
				</div>);
		}
		return (
			<div>
				{this.getLegend()}
				<Calendar propToForceRefresh={this.state.refreshCalendar}
					animal={this.props.animal}/>
			</div>
		);
	}
});

module.exports = AnimalScheduleTab;
