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

	render: function () {
		if (!LoginStore.user || !this.state.member) return null;
		var heading = this.state.member.displayName ?
			this.state.member.displayName : this.state.member.name;
		if (this.state.member) {
			return (
				<div>
					<div className="media padding">
						<div className="media-body">
						<h1>{heading}</h1>
						</div>
					</div>
					<Tabs defaultActiveKey={1}>
						<Tab eventKey={1} title="Groups">
							<UserGroupsTab user={this.state.member}/>
						</Tab>
						<Tab eventKey={2} title="Activity">
							<UserActivityTab user={this.state.member}/>
						</Tab>
						<Tab eventKey={3} title="Calendar">
							<AnimalScheduleTab memberId={this.state.member.id}/>
						</Tab>
					</Tabs>
					<br/><br/>
				</div>
			);
		}
	}
});

module.exports = MemberPage;
