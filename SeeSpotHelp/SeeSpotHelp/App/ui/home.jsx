"use strict"

var GroupHomePage = require("./group/grouphomepage");
var SearchPage = require("./searchpage");
var AnimalHomePage = require("./animalHomePage");
var AddNewGroup = require("./group/addnewgroup");
var AddAdoptablePage = require("./addadoptablepage");
var ProfilePage = require("./profilepage");
var LoginPage = require("./loginpage");
var PrivateBetaPage = require("./privatebetapage");
var GroupAnimalsTab = require("./group/groupanimalstab");
var GroupMembersTab = require("./group/groupmemberstab");
var MyNavBar = require("./navbar");

var LoginService = require("../core/loginservice");
var Volunteer = require("../core/volunteer");

var LoginStore = require("../stores/loginstore");
var LoginActions = require("../actions/loginactions");

var Dispatcher = require("../dispatcher/dispatcher");

var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

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
        console.log("Home::componentDidMount");
        LoginStore.addChangeListener(this.onChange);
        this.setState({
            user: LoginStore.getUser()
        });
        this.loadPageForUser();
    },

    componentWillUnmount: function () {
        console.log("Home:componentWillUnmount");
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        console.log("Home:onChange");
        this.loadPageForUser();
    },

    loadPageForUser: function () {
        console.log("Home::LoadPageForVolunteer");
        console.log(LoginStore.user);

        // If the user is signed in and belongs to a volunteer group, show them that
        // page first.  If they don't, show them their profile page where there will be
        // instructions for how to search or add for a new volunteer group.
        if (LoginStore.user && LoginStore.user.getDefaultVolunteerGroup()) {
            this.context.router.push("/GroupHomePage");
        } else if (LoginStore.user && LoginStore.user.inBeta) {
            this.context.router.push("/profilePage");
        } else if (LoginStore.user && !LoginStore.user.inBeta) {
            this.context.router.push("/privateBetaPage");
        } else {
            this.context.router.push("/loginPage");
        }
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
  <Router path="/" component={Home}>
    <Route path="searchPage" component={SearchPage}/>
    <Route path="groupHomePage" component={GroupHomePage}/>
    <Route path="animalHomePage" component={AnimalHomePage} />
    <Route path="addNewGroup" component={AddNewGroup} />
    <Route path="addAdoptablepage" component={AddAdoptablePage} />
    <Route path="profilePage" component={ProfilePage} />
    <Route path="privateBetaPage" component={PrivateBetaPage} />
    <Route path="loginPage" component={LoginPage} />
    <Route path="groupAnimalsTab" component={GroupAnimalsTab} />
    <Route path="groupMembersTab" component={GroupMembersTab} />
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);
