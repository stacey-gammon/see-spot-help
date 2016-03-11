"use strict";

var React = require("react");

var Utils = require("../core/utils");
var DatePicker = require('react-datepicker');
var moment = require('moment');

require('react-datepicker/dist/react-datepicker.css');

var AddCalendarEvent = React.createClass({
	getInitialState: function() {
		var startDate = Utils.FindPassedInProperty(this, 'startDate');
		return {
			startDate: moment(startDate),
		}
	},

	scheduleEvent: function() {

	},

	handleChange: function(date) {
		this.setState({
			startDate: date
		})
	},

	render: function() {
		return (
			<div>
				<h1>Schedule an Event</h1>
				<br/>
				<div style={{margin: '0 auto', width: '400px'}}>
					<div className="row">
						<div className="col-xs-4">
							<h2>Start date: </h2>
						</div>
						<div className="col-xs-8">
							<DatePicker
								style={{display: 'inline-block', margin: '0px 3px'}}
								id="datePicker"
								selected={this.state.startDate}
								onChange={this.handleChange}
								placeholderText="Start Date"/>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-4">
							<h2>Start time: </h2>
						</div>
						<div className="col-xs-8">
							<input type='text' id='startTime' ref='startTime'/>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-4">
							<h2>End time: </h2>
						</div>
						<div className="col-xs-8">
							<input type='text' id='endTime' ref='endTime'/>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-4">
							<h2>Description: </h2>
						</div>
						<div className="col-xs-8">
							<input type='textarea'
								id='description' ref='description'/>
						</div>
					</div>
					<button className="btn btn-info" onClick={this.scheduleEvent}>Schedule</button>
				</div>
			</div>
		);
	}
});

module.exports = AddCalendarEvent;
