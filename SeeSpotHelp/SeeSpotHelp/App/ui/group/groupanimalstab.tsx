'use strict'

import * as React from 'react';
var Link = require("react-router").Link;

import AnimalList from '../animal/animallist';
var AddAnimalButton = require("../animal/addanimalbutton");

import Volunteer from '../../core/databaseobjects/volunteer';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import DataServices from '../../core/dataservices';

export default class GroupAnimalsTab extends React.Component<any, any> {
	constructor(props) {
		super(props);
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		this.state = {
			group: group
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			group: nextProps.group
		});
	}

	componentDidMount() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	}

	componentWillUnmount() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	}

	onChange() {
		this.setState(
			{
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	}

	render() {
		return (
			<div className="shelterAnimalsTab">
				<AddAnimalButton
					group={this.state.group}
					permission={this.props.permission}/>
				<br/><br/>
				<AnimalList
					group={this.state.group}
					user={LoginStore.getUser()}/>
			</div>
		);
	}
}
