'use strict';

import * as React from 'react';

import InfoBar from '../shared/infobar';
import LoginStore from '../../stores/loginstore';
import GroupInfoBox from './groupinfobox';
import GroupActionsBox from './groupactionsbox';

export default class GroupInfoBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.group != this.props.group ||
			nextProps.permission != this.props.permission;
	}

	render() {
		return (
			<div>
				<InfoBar>
					<div/>
					<GroupInfoBox group={this.props.group} permission={this.props.permission} />
					<GroupActionsBox user={LoginStore.getUser()} group={this.props.group} />
				</InfoBar>
			</div>
		);
	}
}
