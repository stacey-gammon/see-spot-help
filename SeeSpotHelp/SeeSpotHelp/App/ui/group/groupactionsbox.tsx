"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var DataServices = require("../../core/dataservices");
var LoginStore = require("../../stores/loginstore");
var PermissionsStore = require("../../stores/permissionsstore");
var GroupActions = require("../../actions/groupactions");
var LeaveGroupButton = require("./leavegroupbutton");

var GroupActionsBox = React.createClass({
	getInitialState: function() {
		var user = LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;

		var permission = user && group ? PermissionsStore.getPermission(user.id, group.id) : null;

		return {
			user: user,
			group: group,
			permission: permission
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var permission = this.state.user && nextProps.group ?
			PermissionsStore.getPermission(this.state.user.id, nextProps.group.id) : null;

		this.setState({
			group: nextProps.group,
			permission: permission
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var permission = LoginStore.getUser() && this.state.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.state.group.id) : null;
		this.setState(
			{
				user: LoginStore.user,
				permission: permission
			});
	},

	requestToJoin: function () {
		if (!this.state.group || !this.state.user || !this.state.permission) {
			throw "Attempting to join group when user or group is undefined or null";
		}

		var permission = this.state.permission;
		var group = new VolunteerGroup().castObject(this.state.group);
		var user = new Volunteer().castObject(this.state.user);

		if (permission.pending()) {
			permission.permission = VolunteerGroup.PermissionsEnum.NONMEMBER;
			permission.update();
			this.refs.requestToJoinButton.innerHTML = ConstStrings.RequestToJoin;
		} else {
			permission.permission = VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;
			permission.update();
			DataServices.PushFirebaseData('emails/tasks',
				{
					eventType: 'NEW_REQUEST_PENDING',
					adminId: this.state.user.id,
					groupName: this.state.group.name
				 });
			this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
		}
		GroupActions.groupUpdated(this.state.group);
	},

	getRequestToJoinButton: function () {
		console.log("RequestToJoinButton:render, permissions = " + this.state.permission);
		if (!this.state.user) return null;

		if (this.state.permission.inGroup()) {
			return null;
		}
		var text = this.state.permission.pending() ?
			ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;

		return (
			<button className="btn btn-warning requestToJoinButton buttonPadding"
					ref="requestToJoinButton"
					onClick={this.requestToJoin}>
				{text}
			</button>
		);
	},

	render: function () {
		console.log("GroupActionsBox:render:");
		return (
			<div className="GroupActionsBox">
				{this.getRequestToJoinButton()}
			</div>
		);
	}
});

module.exports = GroupActionsBox;
