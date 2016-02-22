"use strict"

var React = require("react");
var AnimalList = require("./animallist");
var ShelterSearchBox = require("./sheltersearchbox");
var ShelterInfoBox = require("./shelterinfobox");
var ShelterActionsBox = require("./shelteractionsbox");
var FakeData = require("../core/fakedata");
var Volunteer = require("../core/volunteer");
var VolunteerGroup = require("../core/volunteergroup");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");
var AJAXServices = require("../core/AJAXServices");

var ShelterHomePage = React.createClass({
    getInitialState: function () {
        var query = this.props.location ? this.props.location.query : null;
        var group = null;
        if (query && query.groupId) {
            group = VolunteerGroup.getFakeGroups()[query.groupId];
        } else if (LoginStore.user) {
            group = GroupStore.getGroupById(LoginStore.user.defaultGroupId);
        }
        return {
            user: LoginStore.user,
            group: group
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillMount: function () {
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user,
                group: GroupStore.getGroupById(this.state.group.id)
            });
    },

    render: function () {
        console.log("shelterhomepage::render");
        var query = this.props.location ? this.props.location.query : null;

        var defaultGroup = null;
        // When the page is loaded up via nav bar, user is stored in this.state.user.
        // When the page is dynamically loaded via home when user logs in, the user
        // is passed in via props.location.state.
        var user = this.state.user;
        if (query && query.groupId) {
            defaultGroup = VolunteerGroup.getFakeGroups()[query.groupId];
            sessionStorage.setItem("defaultGroup", JSON.stringify(defaultGroup));
        }

        if (!defaultGroup && user) {
            defaultGroup = GroupStore.getGroupById(user.defaultGroupId);
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
