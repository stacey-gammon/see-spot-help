"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");

var LeaveGroupButton = React.createClass({
    getInitialState: function() {
        var user = LoginStore.getUser();
        var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
        var permissions = user && group ? group.getUserPermissions(user.id) : null;

        return {
            user: user,
            group: group,
            permissions: permissions
        };
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        var user = LoginStore.getUser();
        var group = this.state.group ? GroupStore.getGroupById(this.state.group.id) : null;
        this.setState(
            {
                user: user,
                group: group,
                permissions: user && group ? group.getUserPermissions(user.id) : null
            });
    },

    leaveGroup: function(event) {
        // This is a hack because a parent LinkContainer element is
        // redirecting the user to another page.
        event.stopPropagation();
        this.state.group.updateMembership(
            this.state.user, VolunteerGroup.PermissionsEnum.NONMEMBER);
    },

    getLeaveGroupButton: function () {
        if (this.state.permissions != VolunteerGroup.PermissionsEnum.MEMBER) {
            return null;
        }
        return (
            <button className="btn btn-warning leaveShelterButton buttonPadding"
                        ref="leaveGroupButton"
                    onClick={this.leaveGroup}>
                    Leave
            </button>
        );
    },

    render: function () {
        console.log("LeaveGroupButton:render:");
        return (
            <div>
                {this.getLeaveGroupButton()}
            </div>
        );
    }
});

module.exports = LeaveGroupButton;
