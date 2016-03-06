"use strict"

var React = require("react");
var Link = require("react-router").Link;
var MemberListItem = require("../memberlistitem");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupActionsBox = require("./groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AJAXServices = require("../../core/AJAXServices");

var GroupMembersTab = React.createClass({
	getInitialState: function () {
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;
		return {
			user: LoginStore.getUser(),
			group: group
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
	},

	componentWillMount: function () {
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user,
				group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
			});
	},

	generateMember: function (member) {
		return (
			<MemberListItem user={this.state.user} member={member} group={this.state.group }/>
		);
	},

	render: function () {
		console.log("GroupMembersTab: render");
		var members = [];
		for (var key in this.props.group.userPermissionsMap) {
			console.log("key = " + key);
			// VolunteerStore will handle downloading any user data we don't currently have
			// locally and will refresh this element in that case.
			var member = VolunteerStore.getVolunteerById(key);
			if (member) {
				members.push(this.generateMember(member));
			}
		}
		return (
			<div className="list-group">
				{members}
			</div>
		);
	}
});

module.exports = GroupMembersTab;
