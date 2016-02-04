"use strict"

var React = require("react");
var AnimalList = require("./animallist");
var ShelterSearchBox = require("./sheltersearchbox");
var ShelterInfoBox = require("./shelterinfobox");
var ShelterActionsBox = require("./shelteractionsbox");
var FakeData = require("../scripts/fakedata");
var FacebookUser = require("../scripts/facebookuser");
var Volunteer = require("../scripts/volunteer");
var VolunteerGroup = require("../scripts/volunteergroup");

var ShelterHomePage = React.createClass({
    getInitialState: function() { return {}
    },

    render: function () {
        console.log("shelterhomepage::render");
        var query = this.props.location ? this.props.location.query : null;
        var defaultGroup = null;

        // When the page is loaded up via nav bar, user is stored in this.props.user.
        // When the page is dynamically loaded via home when user logs in, the user
        // is passed in via props.location.state.
        var user = this.props.user ? Volunteer.castObject(this.props.user) : null;
        if (!user && this.props.location && this.props.location.state) {
            user = this.props.location && this.props.location.state.user ?
                   Volunteer.castObject(this.props.location.state.user) : null;
        }

        if (query && query.groupId) {
            defaultGroup = VolunteerGroup.getFakeGroups()[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }

        if (!defaultGroup && user) {
            defaultGroup = user.getDefaultVolunteerGroup();
        }
        if (defaultGroup) {
            var animals = FakeData.getFakeAnimalDataForGroup(defaultGroup.id);
            return (
                <div className="shelterHomePage">
                    <ShelterInfoBox group={defaultGroup} user={user}/>
                    <ShelterActionsBox user={user} group={defaultGroup}/>
                    <hr/>
                    <AnimalList animals={animals} user={user}/>
                </div>
            );
        } else {
            console.log("No user logged in...");
            return (
                <ShelterSearchBox user={user}/>
            );
        }
    }
});

module.exports = ShelterHomePage;
