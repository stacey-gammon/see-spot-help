"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("./animallist");
var ShelterSearchBox = require("./sheltersearchbox");
var ShelterInfoBox = require("./shelterinfobox");
var ShelterMembersTab = require("./sheltermemberstab");
var ShelterActionsBox = require("./shelteractionsbox");
var FakeData = require("../core/fakedata");
var Volunteer = require("../core/volunteer");
var VolunteerGroup = require("../core/volunteergroup");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");
var AJAXServices = require("../core/AJAXServices");

var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

var LinkContainer = ReactRouterBootstrap.LinkContainer;

var ShelterHomePage = React.createClass({
    getInitialState: function () {
        console.log("ShelterHomePage:getInitialState");
        var query = this.props.location ? this.props.location.query : null;
        var group = null;
        if (query && query.groupId) {
            // TODO: need to load the group on search page.
            group = GroupStore.getGroupById(query.groupId);
        } else {
            group = this.props.location &&
                    this.props.location.state &&
                    this.props.location.state.group ||
                    this.props.group;
            
            if (LoginStore.user && !group) {
                console.log("Default Group id: " + LoginStore.user.defaultGroupId());
                group = GroupStore.getGroupById(LoginStore.user.defaultGroupId());
                console.log(group);
            }
        }
        return {
            user: LoginStore.getUser(),
            group: VolunteerGroup.castObject(group)
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
                group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
            });
    },

    render: function () {
        if (this.state.group) {
            var memberTitle = "Members (" + this.state.group.memberCount() + ")";
            return (
                <div>
                    <ShelterInfoBox group={this.state.group} user={this.state.user} />
                    <ShelterActionsBox user={this.state.user} group={this.state.group} />
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title="Animals">
                            <AnimalList group={this.state.group} user={this.state.user}/>
                        </Tab>
                        <Tab eventKey={2} title={memberTitle}>
                            <ShelterMembersTab group={this.state.group} user={this.state.user}/>
                        </Tab>
                    </Tabs>
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
            return (
            <div>
                <h1>To get started&nbsp;
                <Link to="shelterSearchPage">search</Link>
                    &nbsp;for a group, or <Link to="loginPage">log in</Link> to join or add one.
                </h1>
            </div>
        );
        }
    }
});

module.exports = ShelterHomePage;
