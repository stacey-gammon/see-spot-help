"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../scripts/volunteergroup");
var Volunteer = require("../scripts/volunteer");
var ConstStrings = require("../scripts/conststrings");

var LeaveShelterButton = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        console.log("LeaveShelterButton:render, permissions = " + this.props.permissions);
        if (!this.props.user ||
            this.props.permissions == VolunteerGroup.PermissionsEnum.NONMEMBER) {
            return null;
        }
        return (
            <div className="col-xs-6">
                <button className="btn btn-warning leaveShelterButton"
                        onClick={this.alertNotImplemented}>
                    {ConstStrings.LeaveGroup}
                </button>
            </div>
        );
    }
});


var EditGroupButton = React.createClass({
    editShelter: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        console.log("EditShelterButton:render, permissions = " + this.props.permissions);
        if (this.props.permissions != VolunteerGroup.PermissionsEnum.ADMIN) {
            return null;
        }
        return (
            <div className="col-xs-6">
                <LinkContainer
                    to={{ pathname: "addNewShelter",
                          state: { user: this.props.user, editMode: true, group: this.props.group } }}>
                    <button className="btn btn-info editShelterButton">
                        {ConstStrings.Edit}
                    </button>
                </LinkContainer>
            </div>
        );
    }
});

var RequestToJoinButton = React.createClass({
    requestToJoin: function () {
        if (!this.props.group || !this.props.user) {
            throw "Attempting to join group when user or group is undefined or null";
        }
        var group = VolunteerGroup.castObject(this.props.group);
        var user = Volunteer.castObject(this.props.user);
        group.requestToJoin(user);
        this.refs.requestToJoinButton.disabled = true;
        this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
    },

    render: function () {
        console.log("RequestToJoinButton:render, permissions = " + this.props.permissions);
        if (!this.props.user) return null;

        var pending = this.props.permissions == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP;

        if (this.props.permissions != VolunteerGroup.PermissionsEnum.NONMEMBER &&
            !pending) {
            return null;
        }
        var text = pending ? ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;
        return (
            <div className="col-xs-12">
                <button className="btn btn-warning requestToJoinButton"
                        ref="requestToJoinButton"
                        disabled={pending}
                        onClick={this.requestToJoin}>
                    {text}
                </button>
            </div>
        );
    }
});

var ShelterActionsBox = React.createClass({
    render: function () {
        console.log("ShelterActionsBox:render:");
        var user = this.props.user ? Volunteer.castObject(this.props.user) : null;
        var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
        var permissions = user && group ? group.getUserPermissions(user.id) : null;
        return (
            <div className="container shelterActionsBox">
                <div className="row  pull-left">
                    <LeaveShelterButton permissions={permissions} user={user}/>
                    <RequestToJoinButton permissions={permissions} user={user} group={group} />
                    <EditGroupButton permissions={permissions} user={user} group={group} />
                </div>
            </div>
        );
    }
});

module.exports = ShelterActionsBox;