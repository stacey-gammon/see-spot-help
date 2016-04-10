"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;
var GroupInfoBox = require("./groupinfobox");
var LeaveGroupButton = require("./leavegroupbutton");

import VolunteerGroup from '../../core/volunteergroup';
import Utils from '../../core/utils';
import Volunteer from '../../core/volunteer';
import ConstStrings from '../../core/conststrings';
import Permission from '../../core/permission';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import PermissionsStore from '../../stores/permissionsstore';

var GroupListItem = React.createClass({
	getInitialState: function() {
		var user = Utils.FindPassedInProperty(this, 'user') || LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		return {
			user: user,
			group: group,
			permission: permission
		};
	},
	componentWillReceiveProps: function(nextProps) {

		var permission = LoginStore.getUser() && nextProps.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, nextProps.group.id) :
			Permission.CreateNonMemberPermission();

		this.setState({
			group: nextProps.group,
			user: nextProps.user || LoginStore.getUser(),
			permission: permission
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var user = LoginStore.getUser();
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				user: user,
				group: group,
				permission: permission
			});
	},

	render: function () {
		if (!this.props.user) return null;
		var group = VolunteerGroup.castObject(this.props.group);
		var headerText = this.state.permission.admin() ?
			"(Admin)" : this.state.permission.member() ?
			"(Member)" : this.state.permission.pending() ?
			"(Membership Pending)" : "";
		return (
			<a className="list-group-item groupListElement">
				<LinkContainer to={{ pathname: "GroupHomePage" ,
					state: { user: this.props.user, group: group} }}>
					<div className="media">
						<div className="media-body">
							<h1>{this.props.group.name}</h1>
							<h2>{headerText}</h2>
							<h2>{this.props.group.shelter}</h2>
							<h2>{this.props.group.address}</h2>
							<h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
						</div>
						<div className="media-right">
							<LeaveGroupButton user={this.props.user} group={group} />
						</div>
					</div>
				</LinkContainer>
			</a>
		);
	}
});

module.exports = GroupListItem;
