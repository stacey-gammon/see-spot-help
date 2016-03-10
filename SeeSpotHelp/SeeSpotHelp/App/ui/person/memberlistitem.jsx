"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupInfoBox = require("../../ui/group/groupinfobox");
var GroupStore = require("../../stores/groupstore");
var GroupActions = require("../../actions/groupactions");
var VolunteerStore = require("../../stores/volunteerstore");

var MemberListItem = React.createClass({
	getInitialState: function() {
		var member = this.props.member
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;

		return {
			member: member,
			group: group
		};
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ?
			GroupStore.getGroupById(this.state.group.id) : null;
		var member = this.props.member ?
			VolunteerStore.getVolunteerById(this.props.member.id) : null;
		this.setState(
			{
				member: member,
				group: group
			});
	},

	approveMembership: function () {
		this.state.group.updateMembership(this.props.member, VolunteerGroup.PermissionsEnum.MEMBER);
		GroupActions.groupUpdated(this);
	},

	denyMembership: function () {
		this.state.group.updateMembership(
			this.props.member, VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED);
		GroupActions.groupUpdated(this);
	},

	getApproveMembershipButton: function() {
		var group = VolunteerGroup.castObject(this.props.group);
		var permission = group.getUserPermissions(this.props.member.id);
		var text = permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ? "Approve" :
			permission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED ? "Re-approve" : "";
		if (text != "") {
			return (
				<div>
				  <button className="btn btn-info" onClick={this.approveMembership }>
					{text}
				  </button>
				</div>
			);
		} else {
			return null;
		}
	},

	getBootMembershipButton: function() {
		var group = VolunteerGroup.castObject(this.props.group);
		var permission = group.getUserPermissions(this.props.member.id);
		if (permission == VolunteerGroup.PermissionsEnum.NONMEMBER) return null;

		var text = permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ? "Deny" : "Ban";
		if (permission != VolunteerGroup.PermissionsEnum.ADMIN &&
			permission != VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
			return (
				<div>
				<button className="btn btn-warning" onClick={this.denyMembership }>{text}</button>
				</div>
			);
		} else {
			return null;
		}
	},

	getActions: function () {
		var group = VolunteerGroup.castObject(this.props.group);
		if (LoginStore.user &&
			group.getUserPermissions(LoginStore.user.id) == VolunteerGroup.PermissionsEnum.ADMIN) {
			return (
				<div className="media-right">
					{this.getApproveMembershipButton()}
					{this.getBootMembershipButton()}
				</div>
			);
		} else {
			return null;
		}
	},

	render: function () {
		var group = VolunteerGroup.castObject(this.props.group);
		var memberPermission = group.getUserPermissions(this.props.member.id);

		var className = "list-group-item memberListElement";
		var userPermission = LoginStore.user ?
			group.getUserPermissions(LoginStore.user.id) :
			VolunteerGroup.PermissionsEnum.NONMEMBER;
		if (memberPermission == VolunteerGroup.PermissionsEnum.NONMEMBER) return null;

		if (memberPermission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED ) {
			if (userPermission == VolunteerGroup.PermissionsEnum.ADMIN) {
				className += " membershipRevokedStyle";
			} else {
				// Regular members can't see members denied by the admin.
				return null;
			}
		}

		if (memberPermission == VolunteerGroup.PermissionsEnum.MEMBERSHIPPENDING) {
			if (userPermission == VolunteerGroup.PermissionsEnum.ADMIN ||
				(LoginStore.user && this.props.member.id == LoginStore.user.id)) {
					className += " membershipPendingStyle";
			} else {
				// Regular members can't see members denied by the admin.
				return null;
			}
		}

		var extraInfo = memberPermission == VolunteerGroup.PermissionsEnum.ADMIN ? "(admin)" : "";
		if (userPermission == VolunteerGroup.PermissionsEnum.ADMIN ||
			(LoginStore.user && this.props.member.id == LoginStore.user.id)) {
			extraInfo = memberPermission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ?
				"(membership pending)" :
				memberPermission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED ?
				"(membership denied)" : extraInfo;
		}
		return (
			<a href="#" className={className}>
				<LinkContainer to={{ pathname: "memberPage" ,
					state: { member: this.props.member} }}>
					<div className="media">
						<div className="media-body">
							<h2>{this.props.member.name} {extraInfo}</h2>
						</div>
						{this.getActions()}
					</div>
				</LinkContainer>
			</a>
		);
	}
});

module.exports = MemberListItem;
