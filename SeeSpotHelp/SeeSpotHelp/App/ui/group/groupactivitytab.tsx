'use strict'

import * as React from 'react';

import AnimalActivityItem from '../animal/animalactivityitem';

import Volunteer from '../../core/databaseobjects/volunteer';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import DataServices from '../../core/dataservices';

export default class GroupActivityTab extends React.Component<any, any> {
	constructor(props) { super(props); }

	componentDidMount() {
		AnimalActivityStore.addPropertyListener(
			this, 'groupId', this.props.group.id, this.onChange.bind(this));
		LoginStore.addChangeListener(this.onChange.bind(this));
	}

	componentWillUnmount() {
		AnimalActivityStore.removePropertyListener(this);
		LoginStore.removeChangeListener(this.onChange);
	}

	shouldComponentUpdate(newProps, newState) {
		return newProps.permission != this.props.permission ||
			newProps.group != this.props.group;
	}

	onChange() {
		this.forceUpdate();
	}

	generateActivity(activity) {
		return (
			<AnimalActivityItem key={activity.id}
								activity={activity}
								user={LoginStore.getUser()}
								permission={this.props.permission}
								group={this.props.group}
								showAnimalInfo="true"/>
		);
	}

	render() {
		var activityElements = [];
		var animalActivity = AnimalActivityStore.getItemsByProperty('groupId', this.props.group.id);
		animalActivity.sort(function(a,b) {
			return a.timestamp < b.timestamp ? 1 : -1;
		});

		for (var i = 0; i < animalActivity.length; i++) {
			activityElements.push(this.generateActivity(animalActivity[i]));
		}
		return (
			<div className="list-group">
				{activityElements}
			</div>
		);
	}
}
