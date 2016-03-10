"use strict";

var React = require('react');

var Utils = require("../../core/utils");
var Animal = require("../../core/animal");
var VolunteerGroup = require("../../core/volunteergroup");
var Calendar = require("../calendar");

var AnimalScheduleTab = React.createClass({
	getInitialState: function() {
		return {
			refreshCalendar: false
		}
	},

	getLegend: function() {
		return (<h1>Legend:</h1>);
	},

	componentWillReceiveProps: function() {
		this.setState({refreshCalendar: true});
	},

	render: function() {
		return (
			<div>
				{this.getLegend()}
				<Calendar propToForceRefresh={this.state.refreshCalendar}/>
			</div>
		);
	}
});

module.exports = AnimalScheduleTab;
