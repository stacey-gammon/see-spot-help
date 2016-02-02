"use strict"

var React = require("react");
var AnimalList = require("./animallist");
var ShelterSearchBox = require("./sheltersearchbox");
var ShelterInfoBox = require("./shelterinfobox");
var ShelterActionsBox = require("./shelteractionsbox");
var FakeData = require("../scripts/fakedata");
var FacebookUser = require("../scripts/facebookuser");
var Volunteer = require("../scripts/volunteer");

var ShelterHomePage = React.createClass({
    loadPageForVolunteer: function(volunteer) {
        console.log("loadPageForVolunteer");
        this.setState({volunteer: volunteer, loggingIn: false});
        sessionStorage.setItem("volunteer", JSON.stringify(volunteer));

        // If there isn't yet a default group choosen for this session, seed it from
        // server side data, whatever group the volunteer is a part of.  Searching and
        // selecting another group will overrie the session default, so the user
        // continues to see their last selected group, but it will not be stored on the
        // server unless the volunteer is an actual group member.  Will have to work
        // this use case out more.
        if (!this.state.defaultGroup) {
            this.setState({ "defaultGroup": volunteer.GetDefaultVolunteerGroup() });
        }
    },

    loadFacebookUser: function() {
        console.log("loadFacebookUser");
        // The FB sdk id loaded async, we need to make sure it's available.
        if (typeof FB === "undefined") {
            console.log("FB null, trying again");
            setTimeout(this.loadFacebookUser.bind(this), 10);
            return;
        }
        FacebookUser.getVolunteer(this.loadPageForVolunteer);
    },

    getInitialState: function() {
        var defaultGroup = null;
        if (sessionStorage.getItem("defaultGroup")) {
            defaultGroup = JSON.parse(sessionStorage.getItem("defaultGroup"));
        }

        this.loadFacebookUser();

        return {
            defaultGroup: defaultGroup,
            volunteer: null,
            loggingIn: true
        }
    },

    render: function () {
        console.log("shelterhomepage::render");
        var query = this.props.location.query;
        var defaultGroup = this.state.defaultGroup;
        
        console.log("state default group? " + defaultGroup);
        if (query && query.groupId) {
            defaultGroup = FakeData.fakeVolunteerGroupData[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }
        if (defaultGroup) {
            console.log("Default group selected");
            var animals = FakeData.getFakeAnimalDataForGroup(defaultGroup.id);
            return (
                <div>
                    <ShelterInfoBox group={defaultGroup}/>
                    <ShelterActionsBox />
                    <hr/>
                    <AnimalList animals={animals}/>
                    {this.props.children}
                </div>
            );
        } else if (this.state.loggingIn) {
            console.log("We are still logging in...");
            return(<div></div>);
        } else {
            console.log("No user logged in...");
            return (
                <div>
                    <ShelterSearchBox/>
                </div>
            );
        }
    }
});

module.exports = ShelterHomePage;
