'use strict'

import * as React from 'react';

import AnimalListItem from './animallistitem';
import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';

export default class AnimalList extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	generateAnimal(animal) {
		return (
			<AnimalListItem key={animal.id} animal={animal} user={this.props.user} group={this.props.group }/>
		);
	}

	componentDidMount() {
		if (this.props.group) {
			AnimalStore.addPropertyListener(
				this, 'groupId', this.props.group.id, this.onChange.bind(this));
		}
	}

	componentWillUnmount() {
		AnimalStore.removePropertyListener(this);
	}

	onChange() {
		this.forceUpdate();
	}

	render() {
		if (!this.props.group) return null;
		var animals = AnimalStore.getAnimalsByGroupId(this.props.group.id);
		if (!animals) return null;
		var animalsUiElements = [];
		for (var i = 0; i < animals.length; i++) {
			animalsUiElements.push(this.generateAnimal(animals[i]));
		}
		return (
			<div>
				{animalsUiElements}
			</div>
		);
	}
}
