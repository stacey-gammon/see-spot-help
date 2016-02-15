"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../core/volunteergroup");
var Volunteer = require("../core/volunteer");
var ConstStrings = require("../core/conststrings");
var LoginStore = require("../stores/loginstore");

var ShelterActionsBox = React.createClass({
    getInitialState: function() {
        var user = LoginStore.user;
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

    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },

    getLeaveGroupButton: function () {
        if (!this.state.user ||
            this.state.permissions == VolunteerGroup.PermissionsEnum.NONMEMBER) {
            return null;
        }
        return (
            <button className="btn btn-warning leaveShelterButton buttonPadding"
                    onClick={this.alertNotImplemented}>
                {ConstStrings.LeaveGroup}
            </button>
        );
    },

    getAddAdoptableButton: function () {
        if (!this.state.user ||
            this.state.permissions == VolunteerGroup.PermissionsEnum.NONMEMBER) {
            return null;
        }
        return (
            <LinkContainer
                to={{ pathname: "addAdoptablePage",
                    state: { user: this.state.user, group: this.state.group } }}>
                <button className="btn btn-info addAdoptableButton buttonPadding">
                    <span className="glyphicon glyphicon-plus"/>
                    &nbsp;Animal
                </button>
            </LinkContainer>
        );
    },

    getEditGroupButton: function () {
        if (this.state.permissions != VolunteerGroup.PermissionsEnum.ADMIN) {
            return null;
        }
        return (
            <LinkContainer
                to={{ pathname: "addNewShelter",
                    state: { user: this.state.user, editMode: true, group: this.state.group } }}>
                <button className="btn btn-info editShelterButton buttonPadding"
                        ref="editShelterButton">
                    {ConstStrings.Edit}
                </button>
            </LinkContainer>
        );
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
        console.log("ShelterActionsBox:render:");
        return (
            <div className="shelterActionsBox">
                {this.getEditGroupButton()}
                {this.getAddAdoptableButton()}
                {this.getLeaveGroupButton()}
                {this.getRequestToJoinButton()}
            </div>
        );
    }
});

module.exports = ShelterActionsBox;