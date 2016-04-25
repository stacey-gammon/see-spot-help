'use strict';

import * as React from 'react';
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

import AnimalActivityList from './animalactivitylist';
import AnimalScheduleTab from './animalscheduletab';
import AnimalActionsBar from './animalactionsbar';

import Utils from '../uiutils';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';

export default class GroupPageTabs extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = { animalDefaultTab: null };
		Utils.LoadOrSaveState(this.state);
	}

	componentWillMount() {
		if (this.props.group) {
			PermissionsStore.addPropertyListener(
				this, 'groupId', this.props.group.id, this.forceUpdate.bind(this));
		}
	}

	componentWillUnmount() {
		PermissionsStore.removePropertyListener(this);
	}

	handleTabSelect(key) {
		this.setState({animalDefaultTab : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.animalDefaultTab = key;
		Utils.LoadOrSaveState(stateDuplicate);
	}

	render() {
		var defaultTabKey = this.state.animalDefaultTab ? this.state.animalDefaultTab : 1;
		return (
			<Tabs className="tabs-area" activeKey={defaultTabKey}
				onSelect={this.handleTabSelect.bind(this)}>
				<Tab  className="tab" eventKey={1} title={Utils.getActivityGlyphicon()}>
					<AnimalActionsBar
						group={this.props.group}
						animal={this.props.animal}
						permission={this.props.permission}/>
					<AnimalActivityList
						group={this.props.group}
						animal={this.props.animal}
						permission={this.props.permission}/>
				</Tab>
				<Tab className="tab" eventKey={2} title={Utils.getCalendarGlyphicon()}>
					<AnimalScheduleTab
						group={this.props.group}
						view="animal"
						animalId={this.props.animal.id}
						permission={this.props.permission}/>
				</Tab>
			</Tabs>
		);
	}
}
