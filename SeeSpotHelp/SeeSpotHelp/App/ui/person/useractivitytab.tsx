'use strict'

import * as React from 'react';
import AnimalActivityItem from './animalactivityitem';

import AnimalActivityStore from '../../stores/animalactivitystore';
import VolunteerStore from '../../stores/volunteerstore';

import ActivityElement from '../shared/activityelement';

export default class AnimalActivityList extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			activities: AnimalActivityStore.getItemsByProperty('userId', this.props.userId)
		}
	}

	componentDidMount() {
		AnimalActivityStore.addPropertyListener(
			this, 'userId', this.props.user.id, this.onChange.bind(this));
	}

	onChange() {
		var activities = AnimalActivityStore.getItemsByProperty('userId', this.props.userId);
		this.setState({ activities: activities });
	}

	componentWillUnmount() {
		AnimalActivityStore.removePropertyListener(this);
	}

	generateAnimalNote(note) {
		return (
			<ActivityElement key={note.id}
								activity={note}
								permission={this.props.permission}
								group={this.props.group}
								animal={this.props.animal}/>
		);
	}

	render() {
		var activityElements = this.state.activities.map(this.generateAnimalNote.bind(this));

		var text =
			this.state.activities.length > 0 ? '' : 'Be the first to make a post!';
		if (AnimalActivityStore.areItemsDownloading('animalId', this.props.animal.id)) {
			text = 'Loading...';
		}

		return (
			<div className="list-group">
				{text}
				{activityElements}
			</div>
		);
	}
}
