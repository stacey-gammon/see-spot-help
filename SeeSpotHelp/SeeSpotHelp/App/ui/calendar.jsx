"user strict";

var React = require("react");
var Utils = require("../core/utils");
var ScheduleStore = require("../stores/schedulestore");
var AnimalStore = require("../stores/animalstore");
var VolunteerStore = require("../stores/volunteerstore");
var LoginStore = require("../stores/loginstore");
var moment = require('moment');

var addCalendarEvent = require("./addcalendarevent");

var Calendar = React.createClass({
	getInitialState: function() {
		var animalId = Utils.FindPassedInProperty(this, 'animalId');
		var memberId = Utils.FindPassedInProperty(this, 'memberId');
		var group = Utils.FindPassedInProperty(this, 'group');

		var state = {
			animalId: animalId,
			memberId: memberId,
			group: group,
			defaultView: null
		};
		Utils.LoadOrSaveState(state);
		return state;
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		ScheduleStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);

		this.initializeCalendar();
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		ScheduleStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('addEventSource', this.getEvents());
	},

	getEvents: function() {
		var schedule;
		if (this.state.animalId > 0) {
			schedule = ScheduleStore.getScheduleByAnimalId(this.state.animalId);
		} else if (this.state.group) {
			schedule = ScheduleStore.getScheduleByGroup(this.state.group.id);
		} else if (this.state.memberId) {
			schedule = ScheduleStore.getScheduleByMember(this.state.memberId);
		}

		if (!schedule) return [];

		// Dynamically generate the title in case the animal's or the user's name changes.
		for (var i = 0; i < schedule.length; i++) {
			var event = schedule[i];
			var volunteer = VolunteerStore.getVolunteerById(event.userId);
			var name = volunteer ? volunteer.displayName : '';
			if (this.state.animalId < 0 && this.state.memberId < 0) {
				event.title =
					AnimalStore.getAnimalById(event.animalId, event.groupId).name + '/' + name;
			} else if (this.state.memberId < 0){
				event.title = name;
			} else {
				event.title = AnimalStore.getAnimalById(event.animalId, event.groupId).name;
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
		var animal = AnimalStore.getAnimalById(this.state.animalId);
		var defaultView = this.state.defaultView ? this.state.defaultView : 'month';
		$('#calendar').fullCalendar({
			events: outer.getEvents(animal),

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
						animal: animal,
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
			<div ref="calendar" id="calendar"></div>
		);
	}

});

module.exports = Calendar;
