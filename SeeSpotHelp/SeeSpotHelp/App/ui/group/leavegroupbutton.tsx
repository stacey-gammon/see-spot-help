"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var PermissionsStore = require("../../stores/permissionsstore");

var LeaveGroupButton = React.createClass({
	getInitialState: function() {
		var user = LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = user && group ?
			PermissionsStore.getPermission(user.id, group.id) : null;

		return {
			user: user,
			group: group,
			permission: permission
		};
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
		var user = LoginStore.getUser();
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var permission = user && group ?
			PermissionsStore.getPermission(user.id, group.id) : null;

		this.setState(
			{
				user: user,
				group: group,
				permission: permission
			});
	},

	leaveGroup: function(event) {
		// This is a hack because a parent LinkContainer element is
		// redirecting the user to another page.
		event.stopPropagation();

		this.state.permission.leave();
		this.state.permission.update();
	},

	getLeaveGroupButton: function () {
		// TODO: will have to let admins leave at some point.
		if (!this.state.permission || !this.state.permission.member()) {
			return null;
		}
		return (
			<button className="btn btn-warning leaveShelterButton padding"
						ref="leaveGroupButton"
					onClick={this.leaveGroup}>
					Leave
			</button>
		);
	},

	render: function () {
		console.log("LeaveGroupButton:render:");
		return (
			<div>
				{this.getLeaveGroupButton()}
			</div>
		);
	}
});

module.exports = LeaveGroupButton;
