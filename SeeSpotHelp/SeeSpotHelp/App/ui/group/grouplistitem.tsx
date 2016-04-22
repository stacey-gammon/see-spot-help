'use strict'

import * as React from 'react';
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';
import StoreStateHelper from '../../stores/storestatehelper';

export default class GroupListItem extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			permission: StoreStateHelper.GetPermission(props)
		}
	}

	componentWillMount() {
		if (LoginStore.getUser()) {
			PermissionsStore.addPropertyListener(
				this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
		}
	}

	componentWillUnmount() {
		PermissionsStore.removePropertyListener(this);
	}

	onChange() {
		this.state = {
			permission: StoreStateHelper.GetPermission(this.props)
		}
	}

	render() {
		if (!LoginStore.getUser()) return null;

		var headerText = this.state.permission.admin() ?
			"(Admin)" : this.state.permission.member() ?
			"(Member)" : this.state.permission.pending() ?
			"(Membership Pending)" : "";
		return (
			<a className="list-group-item groupListElement">
				<LinkContainer to={{ pathname: "GroupHomePage", state: { groupId: this.props.group.id} }}>
					<div className="media">
						<div className="media-body">
							<h1>{this.props.group.name}</h1>
							<h2>{headerText}</h2>
							<h2>{this.props.group.shelter}</h2>
							<h2>{this.props.group.address}</h2>
							<h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
						</div>
					</div>
				</LinkContainer>
			</a>
		);
	}
}
