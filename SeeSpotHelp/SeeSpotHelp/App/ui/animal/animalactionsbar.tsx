'use strict'

import * as React from 'react';

import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';

import AddAnimalNote from './addanimalnote';
import ActionsBar from '../shared/actionsbar';

var TakePhotoButton = require("../takephotobutton");
var LinkContainer = require('react-router-bootstrap').LinkContainer;

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
export default class AnimalActionsBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	shouldAllowUserToEdit() {
		return this.props.permission.inGroup();
	}

	render() {
		return (
			<ActionsBar>
				<TakePhotoButton
					group={this.props.group}
					permission={this.props.permission}
					animal={this.props.animal}/>
				<LinkContainer
					disabled={!this.shouldAllowUserToEdit()}
					to={{ pathname: "addAnimalNote",
						state: { animal: this.props.animal,
								 group: this.props.group,
								 mode: 'add' } }}>
					<button className="btn btn-info"
							disabled={!this.shouldAllowUserToEdit()}>
						Post comment
					</button>
				</LinkContainer>
			</ActionsBar>
		);
	}
}
