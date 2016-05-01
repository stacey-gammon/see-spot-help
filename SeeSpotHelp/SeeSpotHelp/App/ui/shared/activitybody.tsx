'use strict'

import * as React from 'react';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import Volunteer from '../../core/databaseobjects/volunteer';
import ConstStrings from '../../core/conststrings';
import LoginStore from '../../stores/loginstore';
import VolunteerStore from '../../stores/volunteerstore';
import PhotoStore from '../../stores/photostore';
import PermissionsStore from '../../stores/permissionsstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import Activity from '../../core/databaseobjects/activity';
import Permission from '../../core/databaseobjects/permission';

export default class ActivityBody extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.activity.isPhotoActivity()) {
			PhotoStore.addPropertyListener(
				this, 'id', this.props.activity.photoId, this.forceUpdate.bind(this));
		}
	}

	componentWillUnmount() {
		PhotoStore.removePropertyListener(this);
	}

	getEditActionButton() {
		if (!this.props.activity.editable() || !LoginStore.getUser() ||
			this.props.activity.userId != LoginStore.getUser().id) {
			return null;
		}
		return (
			<LinkContainer
				to={{ pathname: "addAnimalNote",
					state: { animalId: this.props.activity.animalId,
							activity: this.props.activity,
							groupId: this.props.activity.groupId,
							mode: 'edit' } }}>
				<span style={{marginLeft: '10px'}} className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	}

	getActivityBody() {
		if (!this.props.activity.isPhotoActivity()) {
			return (
				<p>
					{this.props.activity.description}
					<p>{this.getEditActionButton()}</p>
				</p>);
		} else {
			var photo = PhotoStore.getItemById(this.props.activity.photoId);
			if (!photo) {
				return <span className="spinner"><i className='fa fa-spinner fa-spin'></i></span>
			}
			return (
				<img height='200px' src={photo.src} />
			);
		}
	}

	render() {
		return (
			<div>
				{this.getActivityBody()}
			</div>
		);
	}
}
