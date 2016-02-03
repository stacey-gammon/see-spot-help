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

        // This is stupid but because I can't figure out how to pass
        // properties via LinkContainer and am passing state instead,
        // where user is stored varies depending on how the user got
        // here.
        console.log("shelterhomepage::render: props.user = ");
        console.log(this.props.user);
        var user = this.props.user ? Volunteer.castObject(this.props.user) : null;

        console.log("shelterhomepage::render: props.user after cast = ");
        console.log(user);

        if (!user && this.props.location && this.props.location.state) {
            console.log("shelterhomepage:render: Grabbing volunteer object from props.location.state");
            user = this.props.location && this.props.location.state.user ?
                   Volunteer.castObject(this.props.location.state.user) : null;
        }

        if (query && query.groupId) {
            defaultGroup = VolunteerGroup.getFakeGroups()[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }

        if (!defaultGroup && user) {
            console.log("no query group so get default group from user ");
            console.log(user);
            defaultGroup = user.getDefaultVolunteerGroup();
            console.log("DefaultGroup = ");
            console.log(defaultGroup);
        }
        if (defaultGroup) {
            console.log("Default group found");
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
