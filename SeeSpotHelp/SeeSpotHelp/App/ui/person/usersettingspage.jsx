"use strict"

var React = require("react");
var Link = require("react-router").Link;
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var FacebookLogin = require("../facebooklogin");
var GroupInfoBox = require("../group/groupinfobox");
var AddNewGroup = require("../group/addnewgroup");
var SearchPage = require("../searchpage");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var LoginActions = require("../../actions/loginactions");
var UserGroupsTab = require("./usergroupstab");
var UserActivityTab = require("./useractivitytab");
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

var UserSettingsPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		var user = LoginStore.getUser();
		return {
			user: user
		}
	},

	updateSettings: function() {
		this.state.user.name = this.refs.name.value;
		this.state.user.displayName = this.refs.displayName.value;
		this.state.email = this.refs.email.value;
		this.state.user.update();
		this.context.router.push("/profilePage");
	},

	render: function () {
		// There is no user and none is going to be downloaded, we must prompt them to log in.
		// TODO: when we open the app up to the public, we must be able to handle non-logged in
		// users.
		if (!LoginStore.getUser() && !LoginStore.listenersAttached) {
			this.context.router.push("/loginpage");
		}

		if (this.state.user) {
			var displayName = this.state.user.displayName ?
				this.state.user.displayName : this.state.user.name;
			return (
				<div>
					<h1>Settings</h1>
					<br/>
					<div className="input-group">
						<span className="input-group-addon">Email: </span>
						<input type="text"
						   ref="email"
						   className="form-control"
						   defaultValue={this.state.user.email}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Name: </span>
						<input type="text"
							   ref="name"
							   className="form-control"
							   defaultValue={this.state.user.name}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">Display Name: </span>
						<input type="text"
							   ref="displayName"
							   className="form-control"
							   defaultValue={displayName}/>
					</div>
					<p>* Supply a display name if you would like to protect your privacy</p>
					<br/>
					<div style={{textAlign: 'center'}}>
						<button className="btn btn-info" onClick={this.updateSettings}>
							Update
						</button>
						<FacebookLogin displayInline="true"/>

					</div>
				</div>
			);
		} else {
			return (
				<div>
					<h1>To get started, log in with facebook</h1>
					<FacebookLogin />
				</div>
			);
		}
	}
});

module.exports = UserSettingsPage;
