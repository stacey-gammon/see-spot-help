'use strict'

import * as React from 'react';

import LeaveGroupButton from './leavegroupbutton';
import JoinGroupButton from './joingroupbutton';

export default class GroupActionsBox extends React.Component<any, any> {
	constructor(props) { super(props); }

	render() {
		return (
			<div className="GroupActionsBox">
				<JoinGroupButton group={this.props.group} permission={this.props.permission}/>
				<LeaveGroupButton permission={this.props.permission}/>
			</div>
		);
	}
}
