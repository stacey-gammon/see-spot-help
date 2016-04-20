"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");
var AddAnimalButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");

import Volunteer from '../../core/volunteer';
import VolunteerGroup from '../../core/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import DataServices from '../../core/dataservices';

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
		AnimalStore.addChangeListener(this.onChange);
	},

	componentWillMount: function () {
	},

	componentWillUnmount: function () {
		AnimalActivityStore.removeChangeListener(this.onChange);
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		AnimalStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.getUser(),
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	generateActivity: function (activity) {
		return (
			<AnimalActivityItem key={activity.id}
								activity={activity}
								group={this.state.group}
								showAnimalInfo="true"/>
		);
	},

	render: function () {
		if (!this.state.group) return null;
		var notes = [];
		var animals = AnimalStore.getAnimalsByGroupId(this.state.group.id);
		if (!animals) return null;

		for (var i = 0; i < animals.length; i++) {
			var animal = animals[i];
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
