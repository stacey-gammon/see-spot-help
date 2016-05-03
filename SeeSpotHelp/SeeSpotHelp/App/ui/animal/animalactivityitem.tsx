'use strict'

import * as React from 'react';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import Volunteer from '../../core/databaseobjects/volunteer';
import ConstStrings from '../../core/conststrings';
import LoginStore from '../../stores/loginstore';
import VolunteerStore from '../../stores/volunteerstore';
import AnimalStore from '../../stores/animalstore';
import PermissionsStore from '../../stores/permissionsstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import Activity from '../../core/databaseobjects/activity';
import Permission from '../../core/databaseobjects/permission';

import ActivityElement from '../shared/activityelement';

export default class AnimalActivityItem extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = { memberName: 'loading...' };
	}

	componentWillMount() {
		VolunteerStore.ensureItemById(this.props.activity.userId).then(function() {
			var member = VolunteerStore.getVolunteerById(this.props.activity.userId);
			var memberName = member.displayName ? member.displayName : member.name;
			this.setState({ memberName: memberName });
		}.bind(this));
	}

	componentWillUnmount() {
		VolunteerStore.removePropertyListener(this);
	}

	shouldComponentUpdate(newProps, newState) {
		return newProps.permission != this.props.permission ||
			newProps.group != this.props.group ||
			newProps.activity != this.props.activity ||
			newState.memberName != this.state.memberName;
	}

	onChange() {
		this.forceUpdate();
	}

	deleteAction(event) {
		if (confirm("Are you sure you want to delete this post?")) {
			this.props.activity.delete();
		}
	}

	getEditActionButton() {
		if (!LoginStore.getUser() || this.props.activity.userId != LoginStore.getUser().id) {
			return null;
		}
		return (
			<LinkContainer
				to={{ pathname: "addAnimalNote",
					state: { animal: this.props.animal,
							activityId: this.props.activity.id,
							group: this.props.group,
							mode: 'edit' } }}>
				<span style={{marginLeft: '10px'}} className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	}

	getDeleteActionButton() {
		return (
			<div>
				<span onClick={this.deleteAction}
					className="glyphicon glyphicon-remove-circle"/>
			</div>
		);
	}

	getActions() {
		if (!LoginStore.getUser()) return null;
		if (this.props.activity.userId == LoginStore.getUser().id ||
			this.props.permission.admin()) {
			return (
				<div className="media-right">
					{this.getDeleteActionButton()}
				</div>
			);
		} else {
			return null;
		}
	}

	getAnimalNameHeader() {
		if (this.props.showAnimalInfo && this.props.group && this.props.animal) {
			var animalName = this.props.animal.name;
			return (
				<h4>{animalName}</h4>
			);
		} else {
			return null;
		}
	}

	render() {
		var date = this.props.activity.getDateForDisplay();
		var userAndDateInfo = " - " + this.state.memberName + " - " + date;
		return (
			<div className="list-group-item">
				<div className="media">
					<div className="media-body">
						{this.getAnimalNameHeader()}
						<p>{this.props.activity.description}
						{this.getEditActionButton()}</p>
						<p>
						<a><LinkContainer
							to={{ pathname: "/memberPage",
								state: { memberId: this.props.activity.userId} }}>
							<button className="invisible-button">{this.state.memberName}</button>
						</LinkContainer>
						</a>
						{date}
						</p>
					</div>
					{this.getActions()}
				</div>
			</div>
		);
	}
}
