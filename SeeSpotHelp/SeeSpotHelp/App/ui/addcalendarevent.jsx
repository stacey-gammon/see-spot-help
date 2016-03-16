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

var TimePicker = require('bootstrap-timepicker/js/bootstrap-timepicker.js');
require('bootstrap-timepicker/css/bootstrap-timepicker.css');
require('react-datepicker/dist/react-datepicker.css');

var AddCalendarEvent = React.createClass({
	getInitialState: function() {
		var startDate = Utils.FindPassedInProperty(this, 'startDate');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animal = Utils.FindPassedInProperty(this, 'animal');
		var scheduleId = Utils.FindPassedInProperty(this, 'scheduleId');
		var schedule = ScheduleStore.getScheduleById(scheduleId);
		var editMode = Utils.FindPassedInProperty(this, 'editMode');

		if (scheduleId == -1) editMode = false;

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
		if (this.refs.startTime && this.refs.endTime) {
			schedule.start = this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.startTime.value;
			schedule.end = this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.endTime.value;
		} else {
			schedule.start = this.state.startDate.format('MM-DD-YYYY');
		}
		schedule.description = this.refs.description.value;
		schedule.userId = LoginStore.user.id;
		schedule.groupId = this.state.group.id;
		schedule.animalId = this.state.animal.id;
	},

	validateFields: function() {
		if ((this.refs.endTime.value && !this.refs.startTime.value) ||
			(!this.refs.endTime.value && this.refs.startTime.value)) {
			$('#startTimeDiv').addClass('has-error');
			$('#endTimeDiv').addClass('has-error');
			$('#error').html('Please enter both start and end time, or clear both.');
			return true;
		}

		if (this.refs.endTime.value && this.refs.startTime.value) {
			var startDate =
				moment(this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.startTime.value);
			var endDate =
				moment(this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.endTime.value);

			if (endDate.isBefore(startDate)) {
				$('#startTimeDiv').addClass('has-error');
				$('#endTimeDiv').addClass('has-error');
				$('#error').html('Start time must be before end time.');
				return true;
			}
		}

		$('#startTimeDiv').removeClass('has-error');
		$('#endTimeDiv').removeClass('has-error');
		$('#error').html('');
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

		var defaultStartTime = this.state.editMode && this.state.schedule ?
			this.state.schedule.startTime : false;
		var defaultEndTime = this.state.editMode && this.state.schedule ?
			this.state.schedule.endTime : false;
		$('#startTime').timepicker({
			minuteStep: 15,
			showInputs: true,
			template: 'dropdown',
			modalBackdrop: true,
			showSeconds: false,
			showMeridian: true,
			defaultTime: defaultStartTime
		});
		$('#endTime').timepicker({
			minuteStep: 15,
			showInputs: true,
			template: 'dropdown',
			modalBackdrop: true,
			showSeconds: false,
			showMeridian: true,
			defaultTime: defaultEndTime
		});
	},

	clickedStartTime: function() {
		var defaultStartTime = this.state.editMode && this.state.schedule ?
			this.state.schedule.startTime : false;
		if (defaultStartTime == '' && this.refs.startTime.value == '') {
			$('#startTime').timepicker('setTime', '12:00pm');
		}
		$('#startTime').timepicker('showWidget');
	},

	clickedEndTime: function() {
		var defaultEndTime = this.state.editMode && this.state.schedule ?
			this.state.schedule.endTime : false;
		if (defaultEndTime == '' && this.refs.endTime.value == '') {
			$('#endTime').timepicker('setTime', '12:30pm');
		}
		$('#endTime').timepicker('showWidget');
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
					<div id='error' className='has-error'></div>
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
								ref="date"
								disabled={disableEditing}
								selected={this.state.startDate}
								onChange={this.handleDateChange}
								placeholderText="Start Date"/>
					</div>
					<div className="input-group bootstrap-timepicker timepicker"
						 id="startTimeDiv"
						data-provide="timepicker" data-template="modal" data-minute-step="1" data-modal-backdrop="true"  >
						<span className="input-group-addon">Start time:</span>
						<input className="form-control input-small" type='text'
							disabled={disableEditing}
							onClick={this.clickedStartTime}
							defaultValue={defaultStartTime} id='startTime' ref='startTime'/>
					</div>
					<div className="input-group bootstrap-timepicker timepicker" id="endTimeDiv"
						data-provide="timepicker" data-template="modal" data-minute-step="1" data-modal-backdrop="true">
						<span className="input-group-addon">End time:</span>
						<input type='text' disabled={disableEditing}
							defaultValue={defaultEndTime} className="form-control input-small"
							onClick={this.clickedEndTime}
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
