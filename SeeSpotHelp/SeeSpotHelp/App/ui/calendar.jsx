"user strict";

var React = require("react");
var Utils = require("../core/utils");
var ScheduleStore = require("../stores/schedulestore");
var AnimalStore = require("../stores/animalstore");
var VolunteerStore = require("../stores/volunteerstore");
var LoginStore = require("../stores/loginstore");

var addCalendarEvent = require("./addcalendarevent");

var Calendar = React.createClass({
	getInitialState: function() {
		var animal = Utils.FindPassedInProperty(this, 'animal');
		var group = Utils.FindPassedInProperty(this, 'group');

		var state = {
			animal: animal,
			group: group,
			events: this.getEvents(animal)
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

		this.initializeCalendar();
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		ScheduleStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('addEventSource', this.getEvents(this.state.animal));
	},

	getEvents: function(animal) {
		if (animal) {
			var schedule = ScheduleStore.getScheduleByAnimalId(animal.id);
			if (!schedule) return [];

			// Dynamically generate the title in case the animal's or the user's name changes.
			for (var i = 0; i < schedule.length; i++) {
				var event = schedule[i];
				event.title =
					AnimalStore.getAnimalById(event.animalId, event.groupId).name + '/' +
					VolunteerStore.getVolunteerById(event.userId).displayName;
				event.allDay = !event.startTime && !event.endTime;
			}
			return schedule;
		}
	},

	initializeCalendar: function() {
		var outer = this;
		$('#calendar').fullCalendar({
			events: outer.getEvents(outer.state.animal),

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
						animal: this.state.animal,
						editMode: true,
						scheduleId: event.id,
						startDate: event.start
					}
				});
			}.bind(this),

			dayClick: function(date) {
				this.context.router.push({
					pathname: "addCalendarEvent",
					state: {
						group: this.state.group,
						animal: this.state.animal,
						startDate: date.format(),
						editMode: false
					}
				});
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
