﻿"use strict"

var React = require("react");
var Link = require("react-router").Link;
var MemberListItem = require("./memberlistitem");
var ShelterSearchBox = require("./sheltersearchbox");
var ShelterInfoBox = require("./shelterinfobox");
var ShelterActionsBox = require("./shelteractionsbox");
var FakeData = require("../core/fakedata");
var Volunteer = require("../core/volunteer");
var VolunteerGroup = require("../core/volunteergroup");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");
var VolunteerStore = require("../stores/volunteerstore");
var AJAXServices = require("../core/AJAXServices");

var ShelterMembersTab = React.createClass({
    getInitialState: function () {
        var group = this.props.location &&
                    this.props.location.state &&
                    this.props.location.state.group ||
                    this.props.group;
        return {
            user: LoginStore.getUser(),
            group: group
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
        VolunteerStore.addChangeListener(this.onChange);
    },

    componentWillMount: function () {
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
        VolunteerStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user,
                group: this.state.group ? GroupStore.getGroupById(this.state.group.id) : null
            });
    },

    generateMember: function (user) {
        return (
            <MemberListItem user={user} group={this.state.group }/>
        );
    },

    render: function () {
        console.log("ShelterMembersTab: render");
        var members = [];
        for (var key in this.props.group.userPermissionsMap) {
            console.log("key = " + key);
            // VolunteerStore will handle downloading any user data we don't currently have
            // locally and will refresh this element in that case.
            var user = VolunteerStore.getVolunteerById(key);
            if (user) {
                members.push(this.generateMember(user));
            }
        }
        return (
            <div className="list-group">
                {members}
            </div>
        );
    }
});

module.exports = ShelterMembersTab;