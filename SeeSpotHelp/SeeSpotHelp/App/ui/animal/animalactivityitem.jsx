"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AnimalNote = require("../../core/animalnote");
var AnimalActions = require("../../actions/animalactions");

var AnimalActivityItem = React.createClass({
	getInitialState: function() {
		var member = this.props.member
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		return {
			user: LoginStore.getUser(),
			group: group
		};
	},

	deleteAction: function (event) {
		if (confirm("Are you sure you want to delete this post?")) {
			this.props.activity.delete();
			AnimalActions.animalActivityDeleted();
		}
	},

	getEditActionButton: function() {
		return (
			<LinkContainer
				to={{ pathname: "addAnimalNote",
					state: { user: this.state.user,
							 animal: this.props.animal,
							 activity: this.props.activity,
							 group: this.props.group,
							 editMode: true } }}>
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
		if (this.props.activity.userId == this.state.user.id) {
			return (
				<div className="media-right">
					{this.getDeleteActionButton()}
				</div>
			);
		} else if (this.props.group.getUserPermissions(this.state.user.id) ==
				   VolunteerGroup.PermissionsEnum.ADMIN){
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
		if (this.props.showAnimalInfo && this.props.group) {
			var animal = this.props.group.animals[this.props.activity.animalId];
			if (!animal) {
				console.log("WARN: no animal with id " + this.props.activity.animalId +
					" in group " + this.props.group.name);
			}
			var animalName =
				this.props.group.animals[this.props.activity.animalId].name;
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
