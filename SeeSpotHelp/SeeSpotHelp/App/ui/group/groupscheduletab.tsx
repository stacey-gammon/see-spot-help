'use strict';

import * as React from 'react';
import $ = require('jquery');

var Calendar = require('../calendar');

import LoginStore from '../../stores/loginstore';

class GroupScheduleTab extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = { refreshCalendar: false }
	}

	componentWillReceiveProps (nextProps) {
		var props = $.extend(nextProps, {refreshCalendar : true});
		this.setState(props);
	}

	render() {
		if (!this.props.group && this.props.memberId < 0) return null;

		if (this.props.group &&
			(!LoginStore.getUser() ||
			 !this.props.permission.inGroup())) {
			return (
				<div>
					<h1>Only members can view or edit a schedule.</h1>
				</div>
			);
		}
		return (
			<div>
				<Calendar
					propToForceRefresh={this.state.refreshCalendar}
					view='group'
					group={this.props.group} />
			</div>
		);
	}
}

module.exports = GroupScheduleTab;
