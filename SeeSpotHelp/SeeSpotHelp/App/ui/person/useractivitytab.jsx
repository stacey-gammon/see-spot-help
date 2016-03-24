"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("../group/groupinfobox");
var GroupActionsBox = require("../group/groupactionsbox");
var Utils = require("../../core/utils");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalStore = require("../../stores/animalstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AddAnimalButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");

var UserActivityTab = React.createClass({
	getInitialState: function () {
		var group = Utils.FindPassedInProperty(this, 'group');
		return {
			user: LoginStore.getUser(),
			group: group
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group,
			user: nextProps.user
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
		if (!LoginStore.getUser()) return;
		this.setState(
			{
				user: VolunteerStore.getVolunteerById(LoginStore.getUser().id),
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	generateActivity: function (activity) {
		var group = GroupStore.getGroupById(activity.groupId);
		if (!group) return null;
		var animal = AnimalStore.getAnimalById(activity.animalId, activity.groupId);
		if (!animal) return null;
		return (
			<AnimalActivityItem activity={activity}
								animal={animal}
								group={group}
								showAnimalInfo="true"/>
		);
	},

	render: function () {
		if (!this.state.user) return (
			<div>Loading...</div>
		);
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
