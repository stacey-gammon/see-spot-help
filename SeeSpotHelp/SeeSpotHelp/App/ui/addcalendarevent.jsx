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
				<div style={{margin: '0 auto', maxWidth: '600px'}}>
					<div className="input-group">
						<span className="input-group-addon">Start date:</span>
							<DatePicker
								className="form-control"
								style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
								id="datePicker"
								selected={this.state.startDate}
								onChange={this.handleChange}
								placeholderText="Start Date"/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Start time:</span>
						<input className="form-control" type='text' id='startTime' ref='startTime'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">End time:</span>
						<input type='text' className="form-control" id='endTime' ref='endTime'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Description:</span>
						<textarea className="form-control" id='description' ref='description'/>
					</div>
					<button className="btn btn-info" onClick={this.scheduleEvent}>Schedule</button>
				</div>
			</div>
		);
	}
});

module.exports = AddCalendarEvent;
