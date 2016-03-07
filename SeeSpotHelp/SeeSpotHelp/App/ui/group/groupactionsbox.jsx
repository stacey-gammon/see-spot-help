"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var LeaveGroupButton = require("./leavegroupbutton");

var GroupActionsBox = React.createClass({
	getInitialState: function() {
		var user = LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;

		return {
			user: user,
			group: group
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user
			});
	},

	requestToJoin: function () {
		if (!this.state.group || !this.state.user) {
			throw "Attempting to join group when user or group is undefined or null";
		}

		var permissions = this.state.group.getUserPermissions(this.state.user.id);
		var group = VolunteerGroup.castObject(this.state.group);
		var user = Volunteer.castObject(this.state.user);
		var pending = permissions == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;
		if (pending) {
			this.state.group.updateMembership(user, VolunteerGroup.PermissionsEnum.NONMEMBER);
			this.refs.requestToJoinButton.innerHTML = ConstStrings.RequestToJoin;
		} else {
			group.requestToJoin(user);
			this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
		}
		GroupActions.groupUpdated(this);
	},

	getRequestToJoinButton: function () {
		console.log("RequestToJoinButton:render, permissions = " + this.state.permissions);
		if (!this.state.user) return null;

		var permissions = this.state.group.getUserPermissions(this.state.user.id);
		var pending = permissions == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;

		if (permissions != VolunteerGroup.PermissionsEnum.NONMEMBER && !pending) {
			return null;
		}
		var text = pending ? ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;
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
