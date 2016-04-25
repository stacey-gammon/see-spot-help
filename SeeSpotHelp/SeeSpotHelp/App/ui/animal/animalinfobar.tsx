'use strict'

import * as React from 'react';

import Animal from '../../core/databaseobjects/animal';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import Permission from '../../core/databaseobjects/permission';
import PhotoStore from '../../stores/photostore';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';

import InfoBar from '../shared/infobar';

var AnimalPhotoReel = require("./animalphotoreel");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
export default class AnimalInfoBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		PhotoStore.addPropertyListener(
			this, 'animalId', this.props.animal.id, this.forceUpdate.bind(this));
	}

	componentWillUnmount() {
		PhotoStore.removePropertyListener(this);
	}

	shouldAllowUserToEdit() {
		return this.props.permission.inGroup();
	}

	getEditIcon() {
		if (!this.shouldAllowUserToEdit()) return null;
		return (
			<LinkContainer
				to={{ pathname: "addAnimalPage",
					state: { groupId: this.props.group.id,
							animal: this.props.animal,
							mode: 'edit' } }}>
				<span style={{marginLeft: '10px'}}
						className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	}

	render() {
		var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
		var imageSrc = photos && photos.length > 0 ? photos[0].src : this.props.animal.getDefaultPhoto();
		var animal = this.props.animal;
		return (
			<InfoBar>
					<img className="media-object"
						style={{margin: 5 + "px"}}
						height="100px" width="100px"
						src={imageSrc} />
					<div>
						<h1 className="animalInfo">{animal.name}
						{this.getEditIcon()}
						</h1>
						<h2 className="animalInfo">{animal.age} years old</h2>
						<h2 className="animalInfo">{animal.status}</h2>
						<h2 className="animalInfo">{animal.breed}</h2>
						<p className="animalInfo">{animal.description}</p>
					</div>
					<div/>
					<AnimalPhotoReel
						group={this.props.group}
						permission={this.props.permission}
						animal={animal} />
				</InfoBar>
		);
	}
}
