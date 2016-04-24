'use strict'

var React = require("react");
var Link = require("react-router").Link;
var AnimalActivityItem = require("../animal/animalactivityitem");

import Utils from '../uiutils';
import Volunteer from '../../core/databaseobjects/volunteer';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import AnimalStore from '../../stores/animalstore';
import AnimalActivityStore from '../../stores/animalactivitystore';

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
		var animal = AnimalStore.getAnimalById(activity.animalId);
		if (!animal) return null;
		return (
			<AnimalActivityItem activity={activity}
								animal={animal}
								group={group}
								showAnimalInfo="true"/>
		);
	},

	getLoading() {
		return (<div> Loading... </div>);
	},

	render: function () {
		if (!this.state.user) { return this.getLoading(); }
		var notes = AnimalActivityStore.getActivityById(this.state.user.id);
		if (!notes) { return this.getLoading(); }

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
