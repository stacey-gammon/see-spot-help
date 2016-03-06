"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AJAXServices = require("../../core/AJAXServices");
var AddAdoptableButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");

var GroupActivityTab = React.createClass({
	getInitialState: function () {
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		return {
			user: LoginStore.getUser(),
			group: group
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group
		});
	},

	componentDidMount: function () {
		AnimalActivityStore.addChangeListener(this.onChange);
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillMount: function () {
	},

	componentWillUnmount: function () {
		AnimalActivityStore.removeChangeListener(this.onChange);
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user,
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	generateActivity: function (activity) {
		return (
			<AnimalActivityItem activity={activity}
								group={this.state.group}
								showAnimalInfo="true"/>
		);
	},

	render: function () {
		var notes = [];
		for (var key in this.state.group.animals) {
			var animal = this.state.group.animals[key];
			notes = notes.concat(
				AnimalActivityStore.getActivityByAnimalId(animal.id));
		}
		notes.sort(function(a,b) {
			return a.timestamp < b.timestamp ? 1 : -1;
		});

		var displayNotes = [];
		for (var i = 0; i < notes.length; i++) {
			displayNotes.push(this.generateActivity(notes[i]));
		}
		return (
			<div className="list-group">
				{displayNotes}
			</div>
		);
	}
});

module.exports = GroupActivityTab;
