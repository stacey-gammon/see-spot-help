'use strict'

import * as React from 'react';

import AnimalList from '../animal/animallist';
import AddAnimalButton from '../animal/addanimalbutton';

export default class GroupAnimalsTab extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="shelterAnimalsTab">
				<AddAnimalButton
					group={this.props.group}
					permission={this.props.permission}/>
				<br/><br/>
				<AnimalList
					group={this.props.group}
					permission={this.props.permission}/>
			</div>
		);
	}
}
