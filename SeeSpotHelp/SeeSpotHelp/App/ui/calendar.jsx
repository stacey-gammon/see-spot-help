"user strict";

var React = require("react");

var Calendar = React.createClass({
	componentDidMount: function() {
		console.log("Component did mount");
		const { calendar } = this.refs;
		$(calendar).fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},

			dayClick: function() {

			},

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
