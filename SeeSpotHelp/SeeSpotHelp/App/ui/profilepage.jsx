"use strict"

var React = require("react");
var LinkContainer = require("react-router-bootstrap").LinkContainer;
var Link = require("react-router").Link;
var FakeData = require("../scripts/fakedata");
var FacebookUser = require("../scripts/facebookuser");
var Volunteer = require("../scripts/volunteer");
var VolunteerGroup = require("../scripts/volunteergroup");
var FacebookLogin = require("./facebooklogin");
var ShelterInfoBox = require("./shelterinfobox");
var AddNewShelter = require("./addnewshelter");
var ShelterSearchPage = require("./sheltersearchpage");
var LoginStore = require("../stores/loginstore");

var ProfilePage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        var user = LoginStore.user;
        return {
            user: user,
            groups: user.getGroups()
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user
            });
    },
    goToSearchPage: function() {
        this.context.router.push(
            {
                pathname: "/shelterSearchPage",
                state: { user: this.state.user }
            }
        );
    },

    goToAddGroupPage: function() {
        console.log("ProfilePagE::goToAddGroupPage");
        this.context.router.push(
            {
                pathname: "/addNewShelter",
                state: { user: this.state.user }
            }
        );
    },

    getGroupElement: function(group) {
        console.log("ProfilePage:GetGroupElement");
        return (
            <ShelterInfoBox group={group}/>
        );
    },

    getGroups: function() {
        console.log("ProfilePage:getGroups");
        if (this.state.groups.length == 0) {
            return (
                <div>
                    <h1>You are not part of any volunteer groups.  To get started&nbsp;
                    <a href="" onClick={this.goToSearchPage}>search</a> 
                    &nbsp;for a group to join, or&nbsp;
                    <a href="" onClick={this.goToAddGroupPage}>add</a> a new one.
                    </h1>
                </div>
            );
        } else {
            var groups = this.state.groups.map(this.getGroupElement);
            return (
                <div>
                    <h2>Your volunteer groups</h2>
                    {groups}
                </div>
            );
        }
    },

    render: function () {
        console.log("ProfilePage::render");
        if (this.state.user) {
            return (
                <div>
                    <h1>Hello, {this.state.user.name}</h1>
                    <h2>Email: {this.state.user.email}</h2>
                    <hr/>
                    {this.getGroups()}
                </div>
            );
        } else {
            return (
                <div>
                    <h1>To get started, log in with facebook</h1>
                    <FacebookLogin />
                </div>
            );
        }
    }
});

module.exports = ProfilePage;
