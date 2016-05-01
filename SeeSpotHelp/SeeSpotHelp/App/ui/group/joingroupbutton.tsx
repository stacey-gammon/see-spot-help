'use strict'

import * as React from 'react';

import Group from '../../core/databaseobjects/group';
import ConstStrings from '../../core/conststrings';
import DataServices from '../../core/dataservices';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';

export default class JoinGroupButton extends React.Component<any, any> {
	public refs: any;
	constructor(props) { super(props); }

	requestToJoin() {
		if (!this.props.group || !LoginStore.getUser()|| !this.props.permission) {
			return null;
		}

		var permission = this.props.permission;
		if (permission.pending()) {
			permission.permission = Group.PermissionsEnum.NONMEMBER;
			permission.update();
			this.refs.requestToJoinButton.innerHTML = ConstStrings.RequestToJoin;
		} else {
			permission.permission = Group.PermissionsEnum.PENDINGMEMBERSHIP;
			permission.update();
			DataServices.PushFirebaseData('emails/tasks',
				{
					eventType: 'NEW_REQUEST_PENDING',
					adminId: LoginStore.getUser().id,
					groupName: this.props.group.name
				 });
			this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
		}
	}

	render() {
		if (!LoginStore.getUser()) return null;

		if (this.props.permission.inGroup()) {
			return null;
		}

		var text = this.props.permission.pending() ?
			ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;
		var helperText = this.props.permission.pending() ? 'click to cancel' : '';
		return (
			<button className="btn btn-warning requestToJoinButton buttonPadding"
					ref="requestToJoinButton"
					onClick={this.requestToJoin.bind(this)}>
				{text}
			</button>
		);
	}
}
