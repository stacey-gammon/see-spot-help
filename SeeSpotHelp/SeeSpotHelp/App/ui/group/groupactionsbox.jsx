"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var EditGroupButton = require("./editgroupbutton");
var LeaveGroupButton = require("./leavegroupbutton");

var GroupActionsBox = React.createClass({
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

    requestToJoin: function () {
        if (!this.props.group || !this.state.user) {
            throw "Attempting to join group when user or group is undefined or null";
        }
        var group = VolunteerGroup.castObject(this.state.group);
        var user = Volunteer.castObject(this.state.user);
        group.requestToJoin(user);
        this.refs.requestToJoinButton.disabled = true;
        this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
    },

    getRequestToJoinButton: function () {
        console.log("RequestToJoinButton:render, permissions = " + this.state.permissions);
        if (!this.state.user) return null;

        var pending = this.state.permissions == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;

        if (this.state.permissions != VolunteerGroup.PermissionsEnum.NONMEMBER &&
            !pending) {
            return null;
        }
        var text = pending ? ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;
        return (
            <button className="btn btn-warning requestToJoinButton buttonPadding"
                    ref="requestToJoinButton"
                    disabled={pending}
                    onClick={this.requestToJoin}>
                {text}
            </button>
        );
    },

    render: function () {
        console.log("GroupActionsBox:render:");
        return (
            <div className="GroupActionsBox">
                <LeaveGroupButton group={this.state.group} user={this.state.user}/>
                {this.getRequestToJoinButton()}
            </div>
        );
    }
});

module.exports = GroupActionsBox;
