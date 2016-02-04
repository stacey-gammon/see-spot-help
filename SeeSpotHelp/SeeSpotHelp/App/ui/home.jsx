"use strict"

var ShelterHomePage = require("./shelterhomepage");
var ShelterSearchPage = require("./sheltersearchpage");
var AnimalHomePage = require("./animalHomePage");
var AddNewShelter = require("./addnewshelter");
var MyNavBar = require("./navbar");

var FacebookUser = require("../scripts/facebookuser");
var Volunteer = require("../scripts/volunteer");

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

    getInitialState: function() {
        return {};
    },

    logInEvent: function() {
        console.log("logInEvent");
        this.loadFacebookUser();
    },

    logOutEvent: function() {
        console.log("logOutEvent");
        this.loadFacebookUser();
    },

    subscribeToLoginEvents: function() {
        console.log("Home::subscribeToLoginEvents");
        FB.Event.subscribe("auth.login", this.logInEvent);
        FB.Event.subscribe("auth.logout", this.logOutEvent);
    },

    facebookInitialized: function () {
        console.log("Home::facebookInitialized");
        this.subscribeToLoginEvents();
        this.loadFacebookUser();
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
        // Temporary fix for the stupid bug of FB not loading by the time this
        // is called.
        // setTimeout(this.subscribeToLoginEvents, 500);

        var defaultGroup = null;
        if (sessionStorage.getItem("defaultGroup")) {
            defaultGroup = JSON.parse(sessionStorage.getItem("defaultGroup"));
        }

        this.setState({
            defaultGroup: defaultGroup,
            volunteer: null,
            loggingIn: true
        });
    },

    loadPageForVolunteer: function (volunteer) {
        console.log("Home::LoadPageForVolunteer");
        this.setState({user: volunteer, loggingIn: false});
        sessionStorage.setItem("volunteer", JSON.stringify(volunteer));

        // If there isn't yet a default group choosen for this session, seed it from
        // server side data, whatever group the volunteer is a part of.  Searching and
        // selecting another group will overrie the session default, so the user
        // continues to see their last selected group, but it will not be stored on the
        // server unless the volunteer is an actual group member.  Will have to work
        // this use case out more.
        if (!this.state.defaultGroup && volunteer) {
            this.setState({ "defaultGroup": volunteer.getDefaultVolunteerGroup() });
        }

        // TODO: What do we want to happen when a user logs in while on the search pane?
        // Currently we will force them to pop over to the shelter home page. This fell
        // out naturally and was not specifically decided. Figure out what to do.
        if (volunteer && volunteer.getDefaultVolunteerGroup()) {
            console.log("Default volunteer group found, loading shelter home page, volunteer is: ");
            console.log(volunteer);
            this.context.router.push(
                {
                    pathname: "/shelterHomePage",
                    state: { user: volunteer }
                }
            );
        }
    },

    loadFacebookUser: function() {
        console.log("loadFacebookUser");
        FacebookUser.getVolunteer(this.loadPageForVolunteer);
    },

    render: function() {
        console.log("Home::render: volunteer: ");
        console.log(this.state.user);
        return (
          <div>
            <MyNavBar user={this.state.user}/>
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
    <IndexRoute component={ShelterHomePage} />
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);
