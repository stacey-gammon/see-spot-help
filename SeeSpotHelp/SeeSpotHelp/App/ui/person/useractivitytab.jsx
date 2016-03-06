"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("../group/groupinfobox");
var GroupActionsBox = require("../group/groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AnimalStore = require("../../stores/animalstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AJAXServices = require("../../core/AJAXServices");
var AddAnimalButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");

var UserActivityTab = React.createClass({
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
		var group = GroupStore.getGroupById(activity.groupId);
		if (!group) return null;
		return (
			<AnimalActivityItem activity={activity}
								group={group}
								showAnimalInfo="true"/>
		);
	},

	render: function () {
		var notes =
			AnimalActivityStore.getActivityByUserId(this.state.user.id);

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

module.exports = UserActivityTab;
