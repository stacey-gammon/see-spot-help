'use strict'

import * as React from 'react';

export default class LeaveGroupButton extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	leaveGroup(event) {
		// This is a hack because a parent LinkContainer element is
		// redirecting the user to another page.
		event.stopPropagation();

		this.props.permission.leave();
		this.props.permission.update();
	}

	render() {
		// TODO: will have to let admins leave at some point.
		if (!this.props.permission || !this.props.permission.member()) {
			return null;
		}
		return (
			<button className="btn btn-warning leaveShelterButton padding"
					ref="leaveGroupButton"
					onClick={this.leaveGroup}>
				Leave
			</button>
		);
	}
}
