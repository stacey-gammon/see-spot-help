'use strict'

var React = require('react');

var LoginStore = require("../../stores/loginstore");
var VolunteerGroup = require("../../core/volunteergroup");

var GroupInfoBox = React.createClass({
	editGroup: function() {
		this.context.router.push(
			{
				pathname: "/addNewGroup",
				state: {
					group:  this.props.group,
					mode: 'edit'
				}
			});
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getEditButton: function() {
		if (!LoginStore.user ||
			this.props.group.getUserPermissions(LoginStore.user.id) !=
			VolunteerGroup.PermissionsEnum.ADMIN) {
			return null;
		}

		return (
				<span style={{marginLeft: 10 + 'px'}}
					onClick={this.editGroup}
					className="glyphicon glyphicon-edit">
				</span>
		);
	},

	render: function() {
		console.log("GroupInfoBox:render");
		return (
			<div className="shelterInfoBox">
				<h1>{this.props.group.name}{this.getEditButton()}</h1>
				<h2>{this.props.group.shelter}</h2>
				<h2>{this.props.group.address}</h2>
				<h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
			</div>
		);
	}
});

module.exports = GroupInfoBox;
