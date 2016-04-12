"use strict";

var React = require("react");
var Router = require("react-router");
var DatePicker = require('react-datepicker');
var moment = require('moment');

import Utils from '../core/utils';
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';
import ScheduleStore from '../stores/schedulestore';
import VolunteerStore from '../stores/volunteerstore';
import AnimalStore from '../stores/animalstore';
import PermissionsStore from '../stores/permissionsstore';
import Schedule from '../core/schedule';

var TimePicker = require('bootstrap-timepicker/js/bootstrap-timepicker.js');
require('bootstrap-timepicker/css/bootstrap-timepicker.css');
require('react-datepicker/dist/react-datepicker.css');

var AddCalendarEvent = React.createClass({
	getInitialState: function() {
		var startDate = Utils.FindPassedInProperty(this, 'startDate');
		var group = Utils.FindPassedInProperty(this, 'group');
		var animalId = Utils.FindPassedInProperty(this, 'animalId');
		var scheduleId = Utils.FindPassedInProperty(this, 'scheduleId');
		var schedule = ScheduleStore.getScheduleById(scheduleId);
		var mode = Utils.FindPassedInProperty(this, 'mode');
		var startTime = Utils.FindPassedInProperty(this, 'startTime');
		var endTime = Utils.FindPassedInProperty(this, 'endTime');
		var allowAnimalChange = Utils.FindPassedInProperty(this, 'allowAnimalChange');
		var allowGroupChange = Utils.FindPassedInProperty(this, 'allowGroupChange');

		if (scheduleId == -1 || !mode) mode = 'add';

		var state = {
			startDate: moment(startDate, 'MM-DD-YYYY'),
			group: group,
			animalId: animalId,
			schedule: schedule,
			mode: mode,
			updated: false,
			added: false,
			startTime: startTime,
			endTime: endTime,
			allowAnimalChange: allowAnimalChange,
			allowGroupChange: allowGroupChange
		}
		Utils.LoadOrSaveState(state);
		return state;
	},

	saveFieldsIntoSchedule: function(schedule) {
		if (this.refs.startTime.value && this.refs.endTime.value) {
			schedule.start = this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.startTime.value;
			schedule.end = this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.endTime.value;
		} else {
			schedule.start = this.state.startDate.format('MM-DD-YYYY');
		}
		schedule.description = this.refs.description.value;
		schedule.userId = LoginStore.getUser().id;
		schedule.groupId = this.getGroup().id;
		schedule.animalId = this.getAnimal().id;
	},

	// Returns true if an error was found.
	validateFields: function() {
		if (!this.getGroup()) {
			$('#error').html('Sorry, you need to join a group before you can add an event.');
			return true;
		}
		if (!this.getAnimal()) {
			$('#error').html('Sorry, you must select an animal to schedule an event.');
			return true;
		}

		if ((this.refs.endTime.value && !this.refs.startTime.value) ||
			(!this.refs.endTime.value && this.refs.startTime.value)) {
			$('#startTimeDiv').addClass('has-error');
			$('#endTimeDiv').addClass('has-error');
			$('#error').html('Please enter both start and end time, or clear both.');
			return true;
		}

		if (this.refs.endTime.value && this.refs.startTime.value) {
			var startDate =
				moment(this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.startTime.value,
					'MM-DD-YYYY hh:mm a');
			var endDate =
				moment(this.state.startDate.format('MM-DD-YYYY') + ' ' + this.refs.endTime.value,
					'MM-DD-YYYY hh:mm a');

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
			if (this.state.mode == 'edit') {
				this.saveFieldsIntoSchedule(this.state.schedule);
				this.state.schedule.update();
				this.context.router.goBack();
			} else {
				var schedule = new Schedule();
				this.saveFieldsIntoSchedule(schedule);
				schedule.insert();
				this.context.router.goBack();
			}
		}
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
		AnimalStore.addChangeListener(this.onChange);

		// A day click defaults the time to 12 am, lets reset that to a full day event.
		if (this.state.startTime == '12:00 am' && this.state.startTime == this.state.endTime) {
			this.state.startTime = this.state.endTime = '';
		}

		var endTime = this.state.endTime;
		if (endTime && this.state.mode == 'add' && this.state.startTime == endTime) {
			endTime = moment(endTime, 'hh:mm a').add(1, 'hours').format('hh:mm a');
		}

		$('#startTime').timepicker({
			minuteStep: 15,
			showInputs: true,
			template: 'dropdown',
			modalBackdrop: true,
			showSeconds: false,
			showMeridian: true,
			defaultTime: this.state.startTime
		});
		$('#endTime').timepicker({
			minuteStep: 15,
			showInputs: true,
			template: 'dropdown',
			modalBackdrop: true,
			showSeconds: false,
			showMeridian: true,
			defaultTime: endTime
		});
	},

	clickedStartTime: function() {
		var defaultStartTime = this.state.startTime ? this.state.startTime : false;
		if (defaultStartTime == '' && this.refs.startTime.value == '') {
			$('#startTime').timepicker('setTime', '12:00pm');
		}
		$('#startTime').timepicker('showWidget');
	},

	clickedEndTime: function() {
		var defaultEndTime = this.state.endTime ? this.state.endTime : false;
		if (defaultEndTime == '' && this.refs.endTime.value == '') {
			$('#endTime').timepicker('setTime', '12:30pm');
		}
		$('#endTime').timepicker('showWidget');
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		AnimalStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var newGroup = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var group = newGroup ? newGroup : this.state.group;
		this.setState({
			group: group
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
						animalId: this.state.animalId
					}
				}
			);
		}
	},

	getDisableEditing: function() {
		return !LoginStore.getUser() ||
			(this.state.schedule && this.state.schedule.userId != LoginStore.getUser().id);
	},

	getDeleteButton: function() {
		if (this.state.mode == 'add' || this.getDisableEditing()) return null;
		return (
			<button className="btn btn-warning" onClick={this.deleteSchedule}>
				Delete
			</button>
		);
	},

	getUserField: function() {
		if (!this.state.schedule) return null;
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

	getAnimal: function() {
		if (this.state.animalId) {
			if (!this.state.group) return null;
			return AnimalStore.getAnimalById(this.state.animalId);
		} else if (this.refs && this.refs.animalChoice) {
			if (!this.getGroup()) return null;
			return AnimalStore.getAnimalById(this.refs.animalChoice.value);
		} else {
			return null;
		}
	},

	createOptionElement: function (option) {
		return (
			<option value={option.id}>{option.name}</option>
		);
	},

	createGroupDropDown: function () {
		if (!LoginStore.getUser()) return null;
		var groups = GroupStore.getGroupsByUser(LoginStore.getUser());
		var options = groups.map(this.createOptionElement);
		return (
			<div className="form-group" style={{marginBottom: 2 + "px"}}>
				<div className="input-group">
					<span className="input-group-addon">Group:</span>
					<select
						  className="form-control"
						  ref="groupChoice"
						  onChange={this.fillAnimalDropDown}
						  id="groupChoice">
						{options}
					</select>
				</div>
			</div>
		);
	},

	getGroupInputField: function() {
		if (this.state.group) {
			return (
				<div className="input-group">
					<span className="input-group-addon">Group:</span>
					<input className="form-control" disabled value={this.state.group.name}
						type='text' id={this.state.group.id} ref='group'/>
				</div>
			);
		} else {
			return this.createGroupDropDown();
		}
	},

	getGroup: function () {
		var group = this.state.group;
		if (!group && this.refs && this.refs.groupChoice && this.refs.groupChoice.value) {
			group = GroupStore.getGroupById(this.refs.groupChoice.value);
		}
		return group;
	},

	fillAnimalDropDown: function () {
		var group = this.getGroup();
		if (!group) return null;

		$("#animalChoice").empty();
		var options = [];
		var animals = AnimalStore.getAnimalsByGroupId(group.id);
		if (!animals) return null;
		for (var i = 0; i < animals.length; i++) {
			$('#animalChoice').append(
				'<option value=' + animals[i].id + '>' + animals[i].name + '</option>');
		}

	},

	createAnimalDropDown: function () {
		var group = this.getGroup();
		if (!group) return null;

		var options = [];
		var animals = AnimalStore.getAnimalsByGroupId(group.id);
		if (animals) {
			for (var i = 0; i < animals.length; i++) {
				options.push(this.createOptionElement(animals[i]));
			}
		}
		return (
			<div className="form-group" style={{marginBottom: 2 + "px"}}>
				<div className="input-group">
					<span className="input-group-addon">Animal:</span>
					<select
						  className="form-control"
						  ref="animalChoice"
						  id="animalChoice">
						{options}
					</select>
				</div>
			</div>
		);
	},

	getAnimalInputField: function() {
		if (this.state.animalId) {
			var animal = this.getAnimal();
			return (
				<div className="input-group">
					<span className="input-group-addon">Animal:</span>
					<input className="form-control" disabled value={animal.name}
						type='text' id='animal' ref='animal'/>
				</div>
			);
		} else {
			return this.createAnimalDropDown();
		}
	},

	render: function() {
		var header = "Schedule an Event";
		var buttonText = "Schedule";
		if (this.state.updated) header = "Event successfully updated";
		if (this.state.added) header = "Event successsfully added";
		var disableEditing = this.getDisableEditing();
		if (disableEditing) header = "Event";
		if (this.state.mode == 'edit') buttonText = "Update";

		var defaultStartTime = this.state.mode == 'edit' ? this.state.startTime : '';
		var defaultEndTime = this.state.mode == 'edit' ? this.state.endTime : '';
		var defaultDescription = this.state.mode == 'edit' ? this.state.schedule.description : '';

		return (
			<div>
				<h1>{header}</h1>
				<br/>
				<div style={{margin: '0 auto', maxWidth: '600px'}}>
					<div id='error' className='has-error'></div>
					{this.getGroupInputField()}
					{this.getUserField()}
					{this.getAnimalInputField()}
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
