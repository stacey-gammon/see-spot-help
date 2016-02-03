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
    getInitialState: function() { return {}
    },

    render: function () {
        console.log("shelterhomepage::render");
        var query = this.props.location.query;
        var defaultGroup = null;

        // This is stupid but because I can't figure out how to pass
        // properties via LinkContainer and am passing state instead,
        // where user is stored varies depending on how the user got
        // here.
        var user = this.props.user;
        if (!user && this.props.location.state) {
            user = new Volunteer(this.props.location.state.user);
        }

        if (query && query.groupId) {
            defaultGroup = FakeData.fakeVolunteerGroupData[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }

        if (!defaultGroup && user) {
            console.log("no query group so get default group from user ");
            console.log(user);
            defaultGroup = user.GetDefaultVolunteerGroup();
        }
        if (defaultGroup) {
            console.log("Default group found");
            var animals = FakeData.getFakeAnimalDataForGroup(defaultGroup.id);
            return (
                <div>
                    <ShelterInfoBox group={defaultGroup} user={user}/>
                    <ShelterActionsBox user={user}/>
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
