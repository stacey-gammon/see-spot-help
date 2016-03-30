"use strict";

var React = require("react");
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");

var AddAnimalButton = React.createClass({
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

	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var user = LoginStore.getUser();
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		this.setState(
			{
				user: user,
				group: group,
				permissions: user && group ? group.getUserPermissions(user.id) : null
			});
	},

	getAddAnimalButton: function() {
		if (!this.state.user || !this.state.group) {
			return null;
		}
		var permissions = this.state.group.getUserPermissions(this.state.user.id);
		if (!this.state.user ||
			permissions == VolunteerGroup.PermissionsEnum.NONMEMBER ||
			permissions == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ||
			permissions == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
			return null;
		}
		return (
			<div className='center-block' style={{textAlign: 'center'}}>
			<LinkContainer
				to={{pathname: "addAnimalPage",
					state: {user: this.state.user,
							group: this.state.group,
							mode: 'add'}}}>
				<button className="btn btn-info AddAnimalButton padding">
					Add Animal
				</button>
			</LinkContainer>
			</div>
		);
	},

	render: function() {
		console.log("AddAnimalButton:render:");
		return (
			<div>
				{this.getAddAnimalButton()}
			</div>
		);
	}
});

module.exports = AddAnimalButton;
