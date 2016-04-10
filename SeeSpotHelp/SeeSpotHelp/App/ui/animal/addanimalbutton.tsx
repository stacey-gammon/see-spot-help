"use strict";

var React = require("react");
var LinkContainer = require('react-router-bootstrap').LinkContainer;

import VolunteerGroup = require("../../core/volunteergroup");
import Volunteer = require("../../core/volunteer");
import Permission = require("../../core/permission");
import LoginStore = require("../../stores/loginstore");
import GroupStore = require("../../stores/groupstore");
import PermissionsStore = require("../../stores/permissionsstore");

var AddAnimalButton = React.createClass({
	getInitialState: function() {
		var user = LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permission = user && group ?
			PermissionsStore.getPermission(user.id, group.id) :
			Permission.CreateNonMemberPermission();
		return {
			user: user,
			group: group,
			permission: permission
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
		PermissionsStore.removeChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function() {
		var user = LoginStore.getUser();
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var permission = user && group ?
			PermissionsStore.getPermission(user.id, group.id) :
			Permission.CreateNonMemberPermission();
		this.setState(
			{
				user: user,
				group: group,
				permissions: permission
			});
	},

	getAddAnimalButton: function() {
		if (!this.state.user || !this.state.group || !this.state.permission.inGroup()) {
			return null;
		}
		return (
			<div className='center-block' style={{textAlign: 'center'}}>
			<LinkContainer
				to={{pathname: "addAnimalPage",
					state: {user: this.state.user,
							group: this.state.group,
							mode: 'add'}}}>
				<button className="btn btn-info addAnimalButton padding">
					Add Animal
				</button>
			</LinkContainer>
			</div>
		);
	},

	render: function() {
		return (
			<div>
				{this.getAddAnimalButton()}
			</div>
		);
	}
});

module.exports = AddAnimalButton;
