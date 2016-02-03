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
        var defaultGroup = null;
        if (sessionStorage.getItem("defaultGroup")) {
            defaultGroup = JSON.parse(sessionStorage.getItem("defaultGroup"));
        }

        // Temporary fix for the stupid bug of FB not loading by the time this
        // is called.
        setTimeout(this.loadFacebookUser, 500);

        return {
            defaultGroup: defaultGroup,
            volunteer: null,
            loggingIn: true
        }
    },

    loadPageForVolunteer: function(volunteer) {
        console.log("loadPageForVolunteer v= " + volunteer);
        this.setState({user: volunteer, loggingIn: false});
        sessionStorage.setItem("volunteer", JSON.stringify(volunteer));

        // If there isn't yet a default group choosen for this session, seed it from
        // server side data, whatever group the volunteer is a part of.  Searching and
        // selecting another group will overrie the session default, so the user
        // continues to see their last selected group, but it will not be stored on the
        // server unless the volunteer is an actual group member.  Will have to work
        // this use case out more.
        if (!this.state.defaultGroup && volunteer) {
            this.setState({ "defaultGroup": volunteer.GetDefaultVolunteerGroup() });
        }

        if (volunteer && volunteer.GetDefaultVolunteerGroup()) {
            console.log("Default volunteer group found, loading shelter home page, volunteer is: ");
            console.log(volunteer);
            this.context.router.push(
                { pathname: "/shelterHomePage",
                  query: { test: "test" },
                  state: { user: volunteer }
                }
            );
        }
    },

    loadFacebookUser: function() {
        console.log("loadFacebookUser");
        // The FB sdk id loaded async, we need to make sure it's available.
        // Note this still fails sporadically and the check doesn't fix the
        // issue.  Needs to be looked into.  We can include the fb
        // script syncronously to avoid this issue.
        if (typeof FB === "undefined") {
            console.log("FB null, trying again");
            setTimeout(this.loadFacebookUser, 250);
            return;
        }
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
