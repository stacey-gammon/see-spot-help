'use strict'

import * as React from 'react';
import AnimalActivityItem from './animalactivityitem';

import AnimalActivityStore from '../../stores/animalactivitystore';
import VolunteerStore from '../../stores/volunteerstore';

export default class AnimalActivityList extends React.Component<any, any> {
	constructor(props) { super(props); }

	componentDidMount() {
		AnimalActivityStore.addPropertyListener(
			this, 'animalId', this.props.animal.id, this.forceUpdate.bind(this));
		// In case a user changes their name on us, update the note.
		VolunteerStore.addChangeListener(this.forceUpdate);
	}

	componentWillUnmount() {
		AnimalActivityStore.removePropertyListener(this);
		VolunteerStore.removeChangeListener(this.forceUpdate);
	}

	generateAnimalNote(note) {
		return (
			<AnimalActivityItem key={note.id}
								activity={note}
								group={this.props.group}
								animal={this.props.animal}/>
		);
	}

	render() {
		var activity = AnimalActivityStore.getActivityByAnimalId(this.props.animal.id);
		var activityElements = activity.map(this.generateAnimalNote.bind(this));
		var text = activity && activity.length > 0 ? '' : 'Be the first to make a post!';
		return (
			<div className="list-group">
				{text}
				{activityElements}
			</div>
		);
	}
}
