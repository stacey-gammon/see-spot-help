"use strict"

var React = require("react");
var Link = require("react-router").Link;
var AnimalList = require("../animal/animallist");
var SearchBox = require("../searchbox");
var GroupInfoBox = require("./groupinfobox");
var GroupMembersTab = require("./groupmemberstab");
var GroupAnimalsTab = require("./groupanimalstab");
var GroupActivityTab = require("./groupactivitytab");

var GroupActionsBox = require("./groupactionsbox");
var FakeData = require("../../core/fakedata");
var Volunteer = require("../../core/volunteer");
var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AJAXServices = require("../../core/AJAXServices");

var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;
var ReactRouterBootstrap = require("react-router-bootstrap");

var LinkContainer = ReactRouterBootstrap.LinkContainer;

var GroupHomePage = React.createClass({
    getInitialState: function () {
        console.log("GroupHomePage:getInitialState");
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
            // Force refresh via groupstore
            group = group ? GroupStore.getGroupById(group.id) : null;

            if (LoginStore.getUser() && !group) {
                console.log("user = ", LoginStore.getUser());
                var defaultGroupId = LoginStore.getUser().defaultGroupId();
                console.log("Default Group id: " + defaultGroupId);
                group = GroupStore.getGroupById(LoginStore.getUser().defaultGroupId());
                console.log(group);
            }
        }
        var group = group ? VolunteerGroup.castObject(group) : null;
        return {
            user: LoginStore.getUser(),
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
                group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
            });
    },

    render: function () {
        if (this.state.group) {
            var memberTitle = "Members (" + this.state.group.memberCount() + ")";
            return (
                <div>
                    <GroupInfoBox group={this.state.group} user={this.state.user} />
                    <GroupActionsBox user={this.state.user} group={this.state.group} />
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title="Animals">
                            <GroupAnimalsTab group={this.state.group} user={this.state.user}/>
                        </Tab>
                        <Tab eventKey={2} title={memberTitle}>
                            <GroupMembersTab group={this.state.group} user={this.state.user}/>
                        </Tab>
                        <Tab eventKey={3} title="Activity">
                            <GroupActivityTab group={this.state.group} user={this.state.user}/>
                        </Tab>
                    </Tabs>
                </div>
            );
        } else if (LoginStore.user) {
            return (
                <div>
                    <h1>
                        You are not part of any volunteer groups.  To get started&nbsp;
                    <Link to="searchPage">search</Link>
                        &nbsp;for a group to join, or&nbsp;
                    <Link to="addNewGroup">add</Link> a new one.
                    </h1>
                </div>
            );
        } else {
            return (
            <div>
                <h1>To get started&nbsp;
                <Link to="searchPage">search</Link>
                    &nbsp;for a group, or <Link to="loginPage">log in</Link> to join or add one.
                </h1>
            </div>
        );
        }
    }
});

module.exports = GroupHomePage;
