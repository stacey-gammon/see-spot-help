﻿"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupInfoBox = require("./groupinfobox");
var EditGroupButton = require("./editgroupbutton");
var LeaveGroupButton = require("./leavegroupbutton");
var DeleteGroupButton = require("./deletegroupbutton");
var GroupStore = require("../../stores/groupstore");

var GroupListItem = React.createClass({
	getInitialState: function() {
		var user = LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permissions = user && group ? group.getUserPermissions(user.id) : null;

		return {
			user: user,
			group: group,
			permissions: permissions
		};
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var user = LoginStore.getUser();
		console.log("group = ", group);
		this.setState(
			{
				user: user,
				group: group,
				permissions: group ? group.getUserPermissions(user.id) : null
			});
	},

	render: function () {
		console.log("GroupListItem:render:");
		var group = VolunteerGroup.castObject(this.props.group);
		console.log("group: ");
		console.log(group);
		var permission = group.getUserPermissions(this.props.user.id);
		var headerText = permission == VolunteerGroup.PermissionsEnum.ADMIN ?
			"Admin" : permission == VolunteerGroup.PermissionsEnum.MEMBER ?
			"Member" : permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ?
			"Membership Pending" : "";
		return (
			<a className="list-group-item animalListElement">
				<LinkContainer to={{ pathname: "GroupHomePage" ,
					state: { user: this.props.user, group: group} }}>
					<div className="media">
						<div className="media-body">
							<h1>{this.props.group.name}</h1>
							<h2>({headerText})</h2>
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
