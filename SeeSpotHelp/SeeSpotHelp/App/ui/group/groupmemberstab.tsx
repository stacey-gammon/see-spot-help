"use strict"

var React = require("react");
var Link = require("react-router").Link;
var MemberListItem = require("../person/memberlistitem");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");

import Volunteer from '../../core/volunteer';
import VolunteerGroup from '../../core/volunteergroup';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import DataServices from '../../core/dataservices';

var GroupMembersTab = React.createClass({
	getInitialState: function () {
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		return {
			user: LoginStore.getUser(),
			group: group
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
	},

	componentWillMount: function () {
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	generateMember: function (member) {
		return (
			<MemberListItem user={LoginStore.getUser()} member={member} group={this.state.group }/>
		);
	},

	render: function () {
		var members = [];
		for (var key in this.props.group.userPermissionsMap) {
			// VolunteerStore will handle downloading any user data we don't currently have
			// locally and will refresh this element in that case.
			var member = VolunteerStore.getVolunteerById(key);
			if (member) {
				members.push(this.generateMember(member));
			}
		}
		return (
			<div className="list-group">
				{members}
			</div>
		);
	}
});

module.exports = GroupMembersTab;
