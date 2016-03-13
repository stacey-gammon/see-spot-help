"use strict";

var React = require("react");

var Utils = require("../core/utils");
var DatePicker = require('react-datepicker');
var moment = require('moment');
var LoginStore = require('../stores/loginstore');
var GroupStore = require('../stores/groupstore');

require('react-datepicker/dist/react-datepicker.css');

var AddCalendarEvent = React.createClass({
	getInitialState: function() {
		var startDate = Utils.FindPassedInProperty(this, 'startDate');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animal = Utils.FindPassedInProperty(this, 'animal');

		var state = {
			startDate: moment(startDate),
			group: group,
			animal: animal
		}
		Utils.LoadOrSaveState(state);
		return state;
	},

	scheduleEvent: function() {

	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		this.setState({
			group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
		});
	},

	handleDateChange: function(date) {
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
						<span className="input-group-addon">Group:</span>
						<input className="form-control" disabled value={this.state.group.name}
							type='text' id='group' ref='group'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Animal:</span>
						<input className="form-control" disabled value={this.state.animal.name}
							type='text' id='animal' ref='animal'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Start date:</span>
							<DatePicker
								className="form-control"
								style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
								id="datePicker"
								selected={this.state.startDate}
								onChange={this.handleDateChange}
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
