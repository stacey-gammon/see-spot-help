"user strict";

var React = require("react");
var Utils = require("../core/utils");
var ScheduleStore = require("../stores/schedulestore");
var AnimalStore = require("../stores/animalstore");
var VolunteerStore = require("../stores/volunteerstore");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");
var moment = require('moment');

var addCalendarEvent = require("./addcalendarevent");

var Calendar = React.createClass({
	getInitialState: function() {
		var animalId = Utils.FindPassedInProperty(this, 'animalId');
		var memberId = Utils.FindPassedInProperty(this, 'memberId');
		var group = Utils.FindPassedInProperty(this, 'group');
		var view = Utils.FindPassedInProperty(this, 'view');

		var state = {
			animalId: animalId,
			memberId: memberId,
			group: group,
			view: view,
			colorByAnimal: true,
			defaultView: null
		};
		Utils.LoadOrSaveState(state);
		return state;
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group,
			memberId: nextProps.memberId,
			view: nextProps.view,
			animalId: nextProps.animalId
		});
		this.onChange();
	},

	componentDidMount: function() {
		// TODO: We may only care about a subset of changes - for instance if the
		// animal who's schedule that is currently showing gets deleted or downloaded.
		// We can probably be more efficient here!
		LoginStore.addChangeListener(this.onChange);
		ScheduleStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
		AnimalStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);

		this.initializeCalendar();
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		ScheduleStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
		AnimalStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('addEventSource', this.getEvents());
	},

	getColorForVolunteer: function (volunteer, group) {
		if (!volunteer.color) {
			volunteer.color = group.GetColorForVolunteer();
			volunteer.update();
			group.update();
		}
		return volunteer.color;
	},

	getColorForAnimal: function (animal, group) {
		if (!animal.color) {
			animal.color = group.GetColorForAnimal();
			animal.update();
			group.update();
		}
		return animal.color;
	},

	getEvents: function() {
		var schedule;

		if (this.state.view == 'animal' && this.state.animalId) {
			schedule = ScheduleStore.getScheduleByAnimalId(this.state.animalId);
		} else if (this.state.view == 'group' && this.state.group) {
			schedule = ScheduleStore.getScheduleByGroup(this.state.group.id);
		} else if (this.state.view == 'member' && this.state.memberId) {
			schedule = ScheduleStore.getScheduleByMember(this.state.memberId);
		}

		if (!schedule) return [];

		// Dynamically generate the title in case the animal's or the user's name changes.
		for (var i = 0; i < schedule.length; i++) {
			var event = schedule[i];
			var volunteer = VolunteerStore.getVolunteerById(event.userId);
			var animal = AnimalStore.getAnimalById(event.animalId, event.groupId);
			var group = GroupStore.getGroupById(event.groupId);

			// We'll have to wait for them to be downloaded.
			if (!volunteer || !animal) return null;

			var showingGroupCalendar = this.state.animalId < 0 && this.state.memberId < 0;

			if (showingGroupCalendar) {
				event.title = animal.name + '/' + name;
				if (this.state.colorByAnimal) {
					event.color = this.getColorForAnimal(animal, group);
				} else {
					event.color = this.getColorForVolunteer(volunteer, group);
				}
			} else if (this.state.memberId < 0){
				// We are showing only an animals events, color by member.
				event.color = this.getColorForVolunteer(volunteer, group);
				event.title = name;
			} else {
				// We are on a member's tab, color by animal.  Colors might be the same if the user
				// belongs to more than one group.
				event.color = this.getColorForAnimal(animal, group);
				event.title = animal.name;
			}

			event.start = moment(event.start);
			event.allDay = !event.end || event.end == event.start ? true : false;
			if (event.end) {
				event.end = moment(event.end);
			}
		}
		return schedule;
	},

	initializeCalendar: function() {
		var outer = this;
		var defaultView = this.state.defaultView ? this.state.defaultView : 'month';
		$('#calendar').fullCalendar({
			events: outer.getEvents(),

			defaultView: defaultView,

			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},

			eventClick: function(event) {
				if (!event) return false;
				this.context.router.push({
					pathname: "addCalendarEvent",
					state: {
						group: this.state.group,
						animalId: this.state.animalId,
						editMode: true,
						scheduleId: event.id,
						startDate: moment(event.start).format('MM-DD-YYYY'),
						startTime: moment(event.start).format('hh:mm a'),
						endTime: moment(event.end).format('hh:mm a')
					}
				});
			}.bind(this),

			dayClick: function(date) {
				this.context.router.push({
					pathname: "addCalendarEvent",
					state: {
						editMode: false,
						scheduleId: -1,  // Just avoid pulling schedule from local storage,
						group: this.state.group,
						animal: animal,
						startDate: date.format('MM-DD-YYYY'),
						startTime: date.format('hh:mm a'),
						endTime: date.format('hh:mm a')
					}
				});
			}.bind(this),

			viewRender: function(view) {
				this.setState({ defaultView: view.name });
				var stateDuplicate = this.state;
				stateDuplicate.defaultView = view.name;
				Utils.LoadOrSaveState(stateDuplicate);
			}.bind(this)
		});
	},

	componentDidUpdate: function() {
		// This is a really crappy hack. Full Calendar will not render if it's not visible
		// and because of the tabs, it isn't visible at first.  There isn't any react call that
		// I can find that will be called after everything is display on a tab.
		setTimeout(function() {
			$('#calendar').fullCalendar('render');
		}.bind(this), 300);
	},

	render: function() {
		console.log("calendar:render");
		return (
			<div className="calendar-container" ref="calendar" id="calendar"></div>
		);
	}

});

module.exports = Calendar;
