"use strict";

var React = require("react");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var Utils = require("../../core/utils");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var AddNewGroup = require("../group/addnewgroup");
var SearchPage = require("../searchpage");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalScheduleTab = require("../animal/animalscheduletab");

var LoginActions = require("../../actions/loginactions");
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

		var state = {
			member: member
		};
		Utils.LoadOrSaveState(state);
		return state;
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
		var id;
		if (this.state.member) {
			id = this.state.member.id;
		} else if (LoginStore.user){
			id = LoginStore.user.id;
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
		if (!LoginStore.user || !this.state.member) return null;
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
							<AnimalScheduleTab memberId={this.state.member.id} view="member"/>
						</Tab>
					</Tabs>
					<br/><br/>
				</div>
			);
		}
	}
});

module.exports = MemberPage;
