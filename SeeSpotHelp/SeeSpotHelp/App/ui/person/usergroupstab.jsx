"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("../group/groupinfobox");
var GroupActionsBox = require("../group/groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AJAXServices = require("../../core/AJAXServices");
var AddAnimalButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");
var GroupListItem = require("../group/grouplistitem");

var UserGroupsTab = React.createClass({
	getInitialState: function () {
		var user = LoginStore.getUser();
		var groups = user ? GroupStore.getUsersMemberGroups(user) : [];
		return {
			user: user,
			groups: groups
		}
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user,
				groups: GroupStore.getUsersMemberGroups(LoginStore.user)
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

	getGroupElement: function(group) {
		return (
			<GroupListItem user={this.state.user} group={group}/>
		);
	},

	getGroups: function() {
		if (this.state.groups.length == 0) {
			return (
				<div>
					<h1>You are not part of any volunteer groups.  To get started&nbsp;
					<Link to="searchPage">search</Link>
					&nbsp;for a group to join, or&nbsp;
					<Link to="addNewGroup">add</Link> a new one.
					</h1>
				</div>
			);
		} else if (this.state.groups.length) {
			var groups = this.state.groups.map(this.getGroupElement);
			return (
				<div>
					{groups}
					<div>
						<h1>
						<Link to="searchPage">Search</Link>
							&nbsp;for a new group to join, or&nbsp;
						<Link to="addNewGroup">add</Link> your own!
						</h1>
					</div>
				</div>
			);
		} else {
			return <div></div>
		}
	},

	render: function () {
		return (
			<div className="list-group">
				{this.getGroups()}
			</div>
		);
	}
});

module.exports = UserGroupsTab;
