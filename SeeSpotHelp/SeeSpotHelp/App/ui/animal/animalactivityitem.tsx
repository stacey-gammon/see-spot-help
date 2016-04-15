"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import VolunteerGroup from '../../core/volunteergroup';
import Volunteer from '../../core/volunteer';
import ConstStrings from '../../core/conststrings';
import LoginStore from '../../stores/loginstore';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import AnimalStore from '../../stores/animalstore';
import PermissionsStore from '../../stores/permissionsstore';
import AnimalActivityStore from '../../stores/animalactivitystore';
import AnimalNote from '../../core/animalnote';
import Permission from '../../core/permission';

var AnimalActivityItem = React.createClass({
	getInitialState: function() {
		var member = this.props.member
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		return {
			user: LoginStore.getUser(),
			group: group,
			permission: permission
		};
	},

	deleteAction: function (event) {
		if (confirm("Are you sure you want to delete this post?")) {
			this.props.activity.delete();
		}
	},

	getEditActionButton: function() {
		if (!this.state.user ||
			this.props.activity.userId != this.state.user.id) {
			return null;
		}
		return (
			<LinkContainer
				to={{ pathname: "addAnimalNote",
					state: { user: this.state.user,
							 animal: this.props.animal,
							 activity: this.props.activity,
							 group: this.props.group,
							 mode: 'edit' } }}>
				<span style={{marginLeft: '10px'}} className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	},

	getDeleteActionButton: function() {
		return (
			<div>
				<span onClick={this.deleteAction}
					className="glyphicon glyphicon-remove-circle"/>
			</div>
		);
	},

	getActions: function () {
		if (!this.state.user) return null;
		if (this.props.activity.userId == this.state.user.id ||
			this.state.permission.admin()) {
			return (
				<div className="media-right">
					{this.getDeleteActionButton()}
				</div>
			);
		} else {
			return null;
		}
	},

	getAnimalNameHeader: function() {
		if (this.props.showAnimalInfo && this.props.group && this.props.animal) {
			var animalName = this.props.animal.name;
			return (
				<h4>{animalName}</h4>
			);
		} else {
			return null;
		}
	},

	render: function () {
		var member = VolunteerStore.getVolunteerById(this.props.activity.userId);
		var userName =
			!member ?
			"...loading" :
			member.displayName ?
			member.displayName :
			member.name;
		var date = this.props.activity.getDateForDisplay();
		var userAndDateInfo = " - " + userName + " - " + date;
		return (
			<div className="list-group-item">
				<div className="media">
					<div className="media-body">
						{this.getAnimalNameHeader()}
						<p>{this.props.activity.toDisplayString()}
						{this.getEditActionButton()}</p>
						<p>
						<a><LinkContainer
							to={{ pathname: "/memberPage",
								state: { member: member} }}>
							<button className="invisible-button">{userName}</button>
						</LinkContainer>
						</a>
						{date}
						</p>
					</div>
					{this.getActions()}
				</div>
			</div>
		);
	}
});

module.exports = AnimalActivityItem;
