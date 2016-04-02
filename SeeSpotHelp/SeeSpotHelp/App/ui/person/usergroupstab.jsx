"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("../group/groupinfobox");
var GroupActionsBox = require("../group/groupactionsbox");
var Utils = require("../../core/utils");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var DataServices = require("../../core/dataservices");
var AddAnimalButton = require("../animal/addanimalbutton");
var AnimalActivityItem = require("../animal/animalactivityitem");
var GroupListItem = require("../group/grouplistitem");
var Intro = require("../intro");

var UserGroupsTab = React.createClass({
	getInitialState: function () {
		var user = Utils.FindPassedInProperty(this, 'user') || LoginStore.user;
		var groups = user ? GroupStore.getUsersMemberGroups(user) : [];
		return {
			user: user,
			groups: groups
		}
	},

	onChange: function () {
		var user;
		if (!this.state.user) {
			user = LoginStore.user
		} else {
			user = VolunteerStore.getVolunteerById(this.state.user.id);
		}
		this.setState(
			{
				user: user,
				groups: GroupStore.getUsersMemberGroups(LoginStore.user)
			});
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			group: nextProps.group,
			user: nextProps.user
		});
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		VolunteerStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		VolunteerStore.removeChangeListener(this.onChange);
	},

	getGroupElement: function(group) {
		return (
			<GroupListItem user={this.state.user} group={group}/>
		);
	},

	getSearchOrAddText: function() {
		if (!this.state.user) return null;
		if (this.state.user.id != LoginStore.user.id) return null;
		return (
			<div className="text-center">
			<p>
			<Link to="searchPage">Search for a group</Link>&nbsp;|&nbsp;
			<Link to="addNewGroup">Add a new group</Link>
			</p>
			</div>
		);
	},

	getGroups: function() {
		if (!LoginStore.getUser()) return null;
		if (this.state.groups.length == 0 &&
			(!LoginStore.getUser() ||
			 (this.state.user && this.state.user.id != LoginStore.getUser().id))) {
				return (
					<div>This user does not currently belong to any groups.</div>
				);
		} else if (this.state.groups.length == 0) {
			return (
				<Intro />
			);
		} else if (this.state.groups.length) {
			var groups = this.state.groups.map(this.getGroupElement);
			return (
				<div className="text-center groupList">
					{groups}
					<div>
						{this.getSearchOrAddText()}
					</div>
				</div>
			);
		} else {
			console.log("nothing!");
			return <div></div>
		}
	},

	render: function () {
		console.log("usergroupstab.render");
		return (
			<div className="list-group">
				{this.getGroups()}
			</div>
		);
	}
});

module.exports = UserGroupsTab;
