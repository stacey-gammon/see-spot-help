"use strict";

var React = require("react");
var Router = require("react-router");

var Utils = require("../core/utils");
var DatePicker = require('react-datepicker');
var moment = require('moment');
var LoginStore = require('../stores/loginstore');
var GroupStore = require('../stores/groupstore');
var ScheduleStore = require('../stores/schedulestore');
var VolunteerStore = require('../stores/volunteerstore');
var Schedule = require('../core/schedule');

require('react-datepicker/dist/react-datepicker.css');

var AddCalendarEvent = React.createClass({
	getInitialState: function() {
		var startDate = Utils.FindPassedInProperty(this, 'startDate');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animal = Utils.FindPassedInProperty(this, 'animal');
		var scheduleId = Utils.FindPassedInProperty(this, 'scheduleId');
		var schedule = ScheduleStore.getScheduleById(scheduleId);
		var editMode = Utils.FindPassedInProperty(this, 'editMode');

		var state = {
			startDate: moment(startDate),
			group: group,
			animal: animal,
			schedule: schedule,
			editMode: editMode,
			updated: false,
			added: false
		}
		Utils.LoadOrSaveState(state);
		return state;
	},

	saveFieldsIntoSchedule: function(schedule) {
		schedule.start = this.state.startDate.format();
		schedule.startTime = this.refs.startTime.value;
		schedule.endTime = this.refs.endTime.value;
		schedule.description = this.refs.description.value;
		schedule.userId = LoginStore.user.id;
		schedule.groupId = this.state.group.id;
		schedule.animalId = this.state.animal.id;
	},

	validateFields: function() {
		return false;
	},

	scheduleEvent: function() {
		var errorFound = this.validateFields();
		if (!errorFound) {
			if (this.state.editMode) {
				this.saveFieldsIntoSchedule(this.state.schedule);
				this.state.schedule.update();
				this.setState({
					updated: true
				});
			} else {
				var schedule = new Schedule();
				this.saveFieldsIntoSchedule(schedule);
				schedule.insert();
				this.setState({
					added: true
				});
			}
		}
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
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

	deleteSchedule: function() {
		if (confirm("Are you sure you want to permanently delete this event?")) {
			this.state.schedule.delete();
			this.context.router.push(
				{
					pathname: "animalHomePage",
					state: {
						group: this.state.group,
						animal: this.state.animal
					}
				}
			);
		}
	},

	getDisableEditing: function() {
		return !LoginStore.user ||
			(this.state.schedule && this.state.schedule.userId != LoginStore.user.id);
	},

	getDeleteButton: function() {
		if (!this.state.editMode || this.getDisableEditing()) return null;
		return (
			<button className="btn btn-warning"
					onClick={this.deleteSchedule}>
				Delete
			</button>
		);
	},

	getUserField: function() {
		if (this.getDisableEditing()) {
			var member = VolunteerStore.getVolunteerById(this.state.schedule.userId);
			if (!member) return null;
			return (
				<div className="input-group">
					<span className="input-group-addon">Member:</span>
					<input className="form-control" disabled value={member.displayName}
						type='text' id='user' ref='user'/>
				</div>
			);
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	goBack: function() {
		this.context.router.goBack();
	},

	render: function() {
		if (!LoginStore.getUser() || !this.state.group ||
			(this.state.editMode && !this.state.schedule)) return null;
		var header = "Schedule an Event";
		var buttonText = "Schedule";
		if (this.state.updated) header = "Event successfully updated";
		if (this.state.added) header = "Event successsfully added";
		var disableEditing = this.getDisableEditing();
		if (disableEditing) header = "Event";
		if (this.state.editMode) buttonText = "Update";

		var defaultStartTime = this.state.editMode ? this.state.schedule.startTime : '';
		var defaultEndTime = this.state.editMode ? this.state.schedule.endTime : '';
		var defaultDescription = this.state.editMode ? this.state.schedule.description : '';

		return (
			<div>
				<h1>{header}</h1>
				<br/>
				<div style={{margin: '0 auto', maxWidth: '600px'}}>
					<div className="input-group">
						<span className="input-group-addon">Group:</span>
						<input className="form-control" disabled value={this.state.group.name}
							type='text' id='group' ref='group'/>
					</div>
					{this.getUserField()}
					<div className="input-group">
						<span className="input-group-addon">Animal:</span>
						<input className="form-control" disabled value={this.state.animal.name}
							type='text' id='animal' ref='animal'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Date:</span>
							<DatePicker
								className="form-control"
								style={{display: 'inline-block', margin: '0px 3px', width: '300px'}}
								id="datePicker"
								disabled={disableEditing}
								selected={this.state.startDate}
								onChange={this.handleDateChange}
								placeholderText="Start Date"/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Start time:</span>
						<input className="form-control" type='text'
							disabled={disableEditing}
							defaultValue={defaultStartTime} id='startTime' ref='startTime'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">End time:</span>
						<input type='text' disabled={disableEditing}
							defaultValue={defaultEndTime} className="form-control"
							id='endTime' ref='endTime'/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Description:</span>
						<textarea className="form-control" disabled={disableEditing}
							defaultValue={defaultDescription}
							id='description' ref='description'/>
					</div>
					<div style={{textAlign: 'center'}}>
						<button className="btn btn-info" disabled={disableEditing}
							onClick={this.scheduleEvent}>{buttonText}</button>
						{this.getDeleteButton()}
						<button className="btn btn-default" onClick={this.goBack}>
							Back
						</button>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = AddCalendarEvent;
