"use strict"

var ShelterHomePage = require("./shelterhomepage");
var ShelterSearchPage = require("./sheltersearchpage");
var AnimalHomePage = require("./animalHomePage");
var AddNewShelter = require("./addnewshelter");
var AddAdoptablePage = require("./addadoptablepage");
var ProfilePage = require("./profilepage");
var LoginPage = require("./loginpage");
var PrivateBetaPage = require("./privatebetapage");
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
        LoginService.loginWithFacebook();
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

        var defaultGroup = null;
        if (sessionStorage.getItem("defaultGroup")) {
            defaultGroup = JSON.parse(sessionStorage.getItem("defaultGroup"));
        }

        this.setState({
            defaultGroup: defaultGroup
        });
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        console.log("Home:componentWillUnmount");
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        console.log("Home:onChange");
        if (LoginStore.user && LoginStore.user.inBeta) {
            this.loadPageForVolunteer(LoginStore.user);
        } else if (LoginStore.user && !LoginStore.user.inBeta) {
            this.context.router.push("/privateBetaPage");
        } else {
            this.context.router.push("/loginPage");
        }
    },

    loadPageForVolunteer: function (volunteer) {
        console.log("Home::LoadPageForVolunteer");

        // If there isn't yet a default group choosen for this session, seed it from
        // server side data, whatever group the volunteer is a part of.  Searching and
        // selecting another group will overrie the session default, so the user
        // continues to see their last selected group, but it will not be stored on the
        // server unless the volunteer is an actual group member.  Will have to work
        // this use case out more.
        if (!this.state.defaultGroup && volunteer) {
            //this.setState({ "defaultGroup": volunteer.getDefaultVolunteerGroup() });
        }

        // If the user is signed in and belongs to a volunteer group, show them that
        // page first.  If they don't, show them their profile page where there will be
        // instructions for how to search or add for a new volunteer group.
        if (volunteer && volunteer.getDefaultVolunteerGroup()) {
            this.context.router.push("/shelterHomePage");
        } else {
            this.context.router.push("/profilePage");
        }
    },

    render: function () {
        return (
          <div>
            <MyNavBar/>
            {this.props.children}
          </div>
      );
    }
});

var routes = (
  <Router path="/" component={Home}>
    <Route path="shelterSearchPage" component={ShelterSearchPage}/>
    <Route path="shelterHomePage" component={ShelterHomePage}/>
    <Route path="animalHomePage" component={AnimalHomePage} />
    <Route path="addNewShelter" component={AddNewShelter} />
    <Route path="addAdoptablepage" component={AddAdoptablePage} />
    <Route path="profilePage" component={ProfilePage} />
    <Route path="privateBetaPage" component={PrivateBetaPage} />
    <Route path="loginPage" component={LoginPage} />
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);
