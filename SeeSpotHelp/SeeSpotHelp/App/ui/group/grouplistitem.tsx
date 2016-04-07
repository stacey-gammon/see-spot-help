"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Utils = require("../../core/utils");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupInfoBox = require("./groupinfobox");
var LeaveGroupButton = require("./leavegroupbutton");
var GroupStore = require("../../stores/groupstore");

var GroupListItem = React.createClass({
	getInitialState: function() {
		var user = Utils.FindPassedInProperty(this, 'user') || LoginStore.getUser();
		var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
		var permissions = user && group ? group.getUserPermissions(user.id) : null;

		return {
			user: user,
			group: group,
			permissions: permissions
		};
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group,
			user: nextProps.user || LoginStore.getUser()
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
		var user = LoginStore.getUser();
		console.log("group = ", group);
		this.setState(
			{
				user: user,
				group: group,
				permissions: group ? group.getUserPermissions(user.id) : null
			});
	},

	render: function () {
		if (!this.props.user) return null;
		var group = VolunteerGroup.castObject(this.props.group);
		var permission = group.getUserPermissions(this.props.user.id);
		var headerText = permission == VolunteerGroup.PermissionsEnum.ADMIN ?
			"(Admin)" : permission == VolunteerGroup.PermissionsEnum.MEMBER ?
			"(Member)" : permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ?
			"(Membership Pending)" : "";
		return (
			<a className="list-group-item groupListElement">
				<LinkContainer to={{ pathname: "GroupHomePage" ,
					state: { user: this.props.user, group: group} }}>
					<div className="media">
						<div className="media-body">
							<h1>{this.props.group.name}</h1>
							<h2>{headerText}</h2>
							<h2>{this.props.group.shelter}</h2>
							<h2>{this.props.group.address}</h2>
							<h2>{this.props.group.city}, {this.props.group.state} {this.props.group.zipCode}</h2>
						</div>
						<div className="media-right">
							<LeaveGroupButton user={this.props.user} group={group} />
						</div>
					</div>
				</LinkContainer>
			</a>
		);
	}
});

module.exports = GroupListItem;
