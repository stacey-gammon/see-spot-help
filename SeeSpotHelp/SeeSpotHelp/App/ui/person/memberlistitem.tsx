"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var GroupActions = require("../../actions/groupactions");
var GroupInfoBox = require("../../ui/group/groupinfobox");

import VolunteerGroup from '../../core/volunteergroup';
import Volunteer from '../../core/volunteer';
import ConstStrings from '../../core/conststrings';
import DataServices from '../../core/dataservices';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import PermissionsStore from '../../stores/permissionsstore';

var MemberListItem = React.createClass({
	getInitialState: function() {
		var member = this.props.member
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = member && group ?
			PermissionsStore.getPermission(member.id, group.id) : null;
		return {
			member: member,
			group: group,
			permission: permission
		};
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ?
			GroupStore.getGroupById(this.state.group.id) : null;
		var member = this.props.member ?
			VolunteerStore.getVolunteerById(this.props.member.id) : null;
		var permission = member && group ?
			PermissionsStore.getPermission(member.id, group.id) : null;
		this.setState(
			{
				member: member,
				group: group,
				permission: permission
			});
	},

	approveMembership: function () {
		this.state.permission.setMember();
		this.state.permission.update();
		DataServices.PushFirebaseData('emails/tasks',
			{
				eventType: 'REQUEST_APPROVED',
				userEmail: this.state.member.email,
				groupName: this.state.group.name
			 });
	},

	denyMembership: function () {
		this.state.permission.setDenied();
		this.state.permission.update();
	},

	getApproveMembershipButton: function() {
		var text = this.state.permission.pending() ? "Approve" : "";
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
		if (!this.state.permission || this.state.permission.notInGroup()) return null;

		var text = this.state.permission.pending() ? "Deny" : "Ban";
		if (this.state.permission.pending() || this.state.permission.member()) {
			return (
				<div>
				<button className="btn btn-warning" onClick={this.denyMembership}>{text}</button>
				</div>
			);
		} else {
			return null;
		}
	},

	getActions: function () {
		var group = VolunteerGroup.castObject(this.props.group);
		if (!LoginStore.getUser()) return null;

		var userPermission = PermissionsStore.getPermission(LoginStore.getUser().id, group.id);
		if (!userPermission || !userPermission.admin()) return null;

		return (
			<div className="media-right">
				{this.getApproveMembershipButton()}
				{this.getBootMembershipButton()}
			</div>
		);
	},

	render: function () {
		if (PermissionsStore.hasError || LoginStore.hasError) {
			var message = PermissionsStore.errorMessage || LoginStore.errorMessage;
			return (
				<div className='alert alert-danger'> {message} </div>
			);
		}
		if (!LoginStore.getUser()) return null;

		var group = VolunteerGroup.castObject(this.props.group);
		var memberPermission = this.state.permission;
		var userPermission = PermissionsStore.getPermission(LoginStore.getUser().id, group.id);

		if (!userPermission || !memberPermission || memberPermission.notInGroup()) return null;

		var className = "list-group-item memberListElement";

		if (memberPermission.denied()) {
			if (userPermission.admin()) {
				className += " membershipRevokedStyle";
			} else {
				// Regular members can't see members denied by the admin.
				return null;
			}
		}

		if (memberPermission.pending()) {
			if (userPermission.admin() ||
				(LoginStore.getUser() && this.props.member.id == LoginStore.getUser().id)) {
					className += " membershipPendingStyle";
			} else {
				// Regular members can't see members pending.
				return null;
			}
		}

		var extraInfo = memberPermission.admin() ? "(admin)" : "";
		if (userPermission.admin() ||
			(LoginStore.getUser() && this.props.member.id == LoginStore.getUser().id)) {
			extraInfo = memberPermission.pending() ?
				"(membership pending)" :
				memberPermission.denied() ?
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
