"use strict"

var React = require("react");
var Link = require("react-router").Link;
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
        console.log("ShelterHomePage:getInitialState");
        var query = this.props.location ? this.props.location.query : null;
        var group = null;
        if (query && query.groupId) {
            // TODO: need to load the group on search page.
            group = GroupStore.getGroupById(query.groupId);
        } else if (LoginStore.user) {
            if (LoginStore.user.defaultGroupId) {
                console.log("Default Group id: " + LoginStore.user.defaultGroupId);
                group = GroupStore.getGroupById(LoginStore.user.defaultGroupId);
                console.log(group);
            } else {
                console.log("No default group selected, so just grabbing the first group");
                var memberGroups = GroupStore.getUsersMemberGroups(LoginStore.user);
                group = memberGroups.length ? memberGroups[0] : null;
            }
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
        if (this.state.group) {
            return (
                <div className="shelterHomePage">
                    <ShelterInfoBox group={this.state.group} user={this.state.user}/>
                    <ShelterActionsBox user={this.state.user} group={this.state.group}/>
                    <hr/>
                    <AnimalList group={this.state.group} user={this.state.user}/>
                </div>
            );
        } else if (LoginStore.user) {
            return (
                <div>
                    <h1>
                        You are not part of any volunteer groups.  To get started&nbsp;
                    <Link to="shelterSearchPage">search</Link>
                        &nbsp;for a group to join, or&nbsp;
                    <Link to="addNewShelter">add</Link> a new one.
                    </h1>
                </div>
            );
        } else {
            <div>
                <h1>To get started&nbsp;
            <Link to="shelterSearchPage">search</Link>
                &nbsp;for a group, or <Link to="loginPage">log in</Link> to join or add one.
            </h1>
        </div>
        }
    }
});

module.exports = ShelterHomePage;
