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

import ActivityBody from './activitybody';

export default class ActivityElement extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			memberName: 'loading...',
		};
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
		return newState.permission != this.props.permission ||
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
					state: { activity: this.props.activity,
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

	render() {
		var date = this.props.activity.getDateForDisplay();
		var userAndDateInfo = " - " + this.state.memberName + " - " + date;
		return (
			<div className="list-group-item">
				<div className="media">
					<div className="media-body">
						<ActivityBody activity={this.props.activity}/>
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
