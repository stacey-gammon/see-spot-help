"use strict";

var React = require("react");
import Permission from "../../core/permission";
import Volunteer from "../../core/volunteer";
import VolunteerGroup from "../../core/volunteergroup";
import Utils from "../../core/utils";
import LoginStore from "../../stores/loginstore";
import GroupStore from "../../stores/groupstore";
import PermissionsStore from "../../stores/permissionsstore";
import VolunteerStore from "../../stores/volunteerstore";

var MemberScheduleTab = require("./memberscheduletab");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var AddNewGroup = require("../group/addnewgroup");
var SearchPage = require("../searchpage");

var UserGroupsTab = require("./usergroupstab");
var UserActivityTab = require("./useractivitytab");
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

var MemberPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		var member = Utils.FindPassedInProperty(this, 'member') || LoginStore.getUser();

		var permission = LoginStore.getUser() && this.state.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.state.group.id) :
			Permission.CreateNonMemberPermission();
		var state = {
			member: member
		};
		Utils.LoadOrSaveState(state);
		return state;
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		GroupStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		GroupStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var id;
		if (this.state.member) {
			id = this.state.member.id;
		} else if (LoginStore.getUser()){
			id = LoginStore.getUser().id;
		}
		this.setState(
			{
				member: VolunteerStore.getVolunteerById(id)
			});
	},

	handleTabSelect: function(key) {
		this.setState({memberDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.memberDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	},

	render: function () {
		if (!LoginStore.getUser() || !this.state.member) return null;
		var heading = this.state.member.displayName ?
			this.state.member.displayName : this.state.member.name;
		if (this.state.member) {
			var defaultKey = this.state.memberDefaultTabKey ? this.state.memberDefaultTabKey : 1;
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>{heading}</h1>
						</div>
					</div>
					<Tabs activeKey={defaultKey} onSelect={this.handleTabSelect}>
						<Tab eventKey={1} title="Groups">
							<UserGroupsTab user={this.state.member}/>
						</Tab>
						<Tab eventKey={2} title={Utils.getActivityGlyphicon()}>
							<UserActivityTab user={this.state.member}/>
						</Tab>
						<Tab eventKey={3} title={Utils.getCalendarGlyphicon()}>
							<MemberScheduleTab
								memberId={this.state.member.id}
								view="member"/>
						</Tab>
					</Tabs>
					<br/><br/>
				</div>
			);
		}
	}
});

module.exports = MemberPage;