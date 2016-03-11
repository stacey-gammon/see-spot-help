"user strict";

var React = require("react");
var Utils = require("../core/utils");
var addCalendarEvent = require("./addcalendarevent");

var Calendar = React.createClass({
	getInitialState: function() {
		var animal = Utils.FindPassedInProperty(this, 'animal');
		return {
			animal: animal
		}
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	componentDidMount: function() {
		const { calendar } = this.refs;
		var outer = this;
		$(calendar).fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},

			dayClick: function(date) {
				this.context.router.push({
					pathname: "addCalendarEvent",
					state: {
						group: this.state.group,
						animal: this.state.animal,
						startDate: date.format()
					}
				});
			}.bind(this),

			eventRender: function(event, element) {
				$(element).addTouch();
			}
		});
	},

	componentDidUpdate: function() {
		// This is a really crappy hack. Full Calendar will not render if it's not visible
		// and because of the tabs, it isn't visible at first.  There isn't any react call that
		// I can find that will be called after everything is display on a tab.
		setTimeout(function() {
			$('#calendar').fullCalendar('render');
		}, 500);
	},

	render: function() {
		console.log("calendar:render");
		return (
			<div ref="calendar" id="calendar"></div>
		);
	}

});

module.exports = Calendar;
