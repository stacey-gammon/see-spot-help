'use strict';

import * as React from 'react';
var ReactBootstrap = require('react-bootstrap');
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

var UserGroupsTab = require('./usergroupstab');
import UserActivityTab from './useractivitytab';
import ActivityTab from '../shared/tabs/activitytab';
var MemberScheduleTab = require('./memberscheduletab');

import Utils from '../uiutils';
import LoginStore from '../../stores/loginstore';

export default class ProfilePageTabs extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = { profileDefaultTabKey: null };
		Utils.LoadOrSaveState(this.state);
	}

	handleTabSelect(key) {
		this.setState({profileDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.groupDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	}

	render() {
		var defaultKey = this.state.profileDefaultTabKey ? this.state.profileDefaultTabKey : 1;
		return (
			<Tabs className='tabs-area' activeKey={defaultKey} onSelect={this.handleTabSelect.bind(this)}>
				<Tab className='tab' eventKey={1} title='Groups'>
					<UserGroupsTab user={this.props.user}/>
				</Tab>
				<Tab className='tab' eventKey={2} title={Utils.getActivityGlyphicon()}>
					<ActivityTab property='userId' value={this.props.user.id} />
				</Tab>
				<Tab className='tab' eventKey={3} title={Utils.getCalendarGlyphicon()}>
					<MemberScheduleTab view='profile' user={this.props.user}/>
				</Tab>
			</Tabs>
		);
	}
}
