﻿"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var browserHistory = ReactRouter.browserHistory;
var IndexRoute = ReactRouter.IndexRoute;

var MyNavBar = require("./navbar");
var User = require("../core/volunteer");
/* eslint-enable no-unused-vars */

var GroupHomePage = require("./group/grouphomepage");
var SearchPage = require("./searchpage");
var AnimalHomePage = require("./animal/animalHomePage");
var AddNewGroup = require("./group/addnewgroup");
var AddAnimalPage = require("./animal/addanimalpage");
var ProfilePage = require("./person/profilepage");
var MemberPage = require("./person/memberpage");
var LoginPage = require("./loginpage");
var PrivateBetaPage = require("./privatebetapage");
var GroupAnimalsTab = require("./group/groupanimalstab");
var GroupMembersTab = require("./group/groupmemberstab");
var AddAnimalNote = require("./animal/addanimalnote");
var UserSettingsPage = require("./person/usersettingspage");
var LoginService = require("../core/loginservice");
var LoginStore = require("../stores/loginstore");
var LoginActions = require("../actions/loginactions");

var Home = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		return {};
	},

	subscribeToLoginEvents: function() {
		FB.Event.subscribe("auth.login", LoginService.loginWithFacebook);
		FB.Event.subscribe("auth.logout", LoginActions.userLoggedOut);
	},

	facebookInitialized: function () {
		this.subscribeToLoginEvents();
	},

	componentWillMount: function () {
		var home = this;
		window.fbAsyncInit = function () {
			FB.init({
				appId: '1021154377958416',
				xfbml: true,
				version: 'v2.5'
			});
			home.facebookInitialized();
		};

		(function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1021154377958416";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	},

	componentDidMount: function() {
		// console.log("Home::componentDidMount");
		LoginStore.addChangeListener(this.onChange);
		this.setState({
			user: LoginStore.getUser()
		});
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.getUser()
			}
		)
	},

	render: function () {
		if (LoginStore.user && LoginStore.user.inBeta) {
			return (
			  <div>
				<MyNavBar/>
				{this.props.children}
			  </div>
		  );
		} else {
			return (
				<div>
					{this.props.children}
				</div>
				);
		}
	}
});

var routes = (
	<Router history={browserHistory} path="/" component={Home}>
		<IndexRoute component={ProfilePage} />
		<Route path="searchPage" component={SearchPage}/>
		<Route path="groupHomePage" component={GroupHomePage}/>
		<Route path="animalHomePage" component={AnimalHomePage} />
		<Route path="addNewGroup" component={AddNewGroup} />
		<Route path="addAnimalPage" component={AddAnimalPage} />
		<Route path="profilePage" component={ProfilePage} />
		<Route path="memberPage" component={MemberPage} />
		<Route path="privateBetaPage" component={PrivateBetaPage} />
		<Route path="loginPage" component={LoginPage} />
		<Route path="groupAnimalsTab" component={GroupAnimalsTab} />
		<Route path="groupMembersTab" component={GroupMembersTab} />
		<Route path="addAnimalNote" component={AddAnimalNote} />
		<Route path="userSettingsPage" component={UserSettingsPage} />
	</Router>
);

ReactDOM.render(
	<Router routes={routes}/>,
	document.getElementById('content')
);
