'use strict'

var React = require('react');
var AnimalActivityItem = require("./animalactivityitem");

import AnimalActivityStore from '../../stores/animalactivitystore';
import VolunteerStore from '../../stores/volunteerstore';

var AnimalActivityList = React.createClass({
	getInitialState: function() {
		return {
			animal: this.props.animal
		};
	},

	componentDidMount: function () {
		AnimalActivityStore.addChangeListener(this.onChange);
		// In case a user changes their name on us, update the note.
		VolunteerStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		AnimalActivityStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				animal: this.props.animal
			});
	},

	generateAnimalNote: function (note) {
		return (
			<AnimalActivityItem activity={note}
								group={this.props.group}
								animal={this.props.animal}/>
		);
	},

	render: function () {
		var notes = AnimalActivityStore.getActivityByAnimalId(this.props.animal.id);
		console.log("AnimalActivityList:render with notes:", notes);
		var displayNotes = [];
		for (var i = 0; i < notes.length; i++) {
			displayNotes.push(this.generateAnimalNote(notes[i]));
		}
		var text = notes && notes.length > 0 ? '' :
			"No activity posted yet.";
		return (
			<div className="list-group">
				{text}
				{displayNotes}
			</div>
		);
	}
});

module.exports = AnimalActivityList;
