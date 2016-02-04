"use strict"

var React = require("react");
var VolunteerGroup = require("../scripts/volunteergroup");
var Volunteer = require("../scripts/volunteer");

var LeaveShelterButton = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        console.log("LeaveShelterButton:render, permissions = " + this.props.permissions);
        if (this.props.permissions == VolunteerGroup.PermissionsEnum.NONMEMBER)
            return null;
        return (
            <div>
                <button className="btn btn-warning leaveShelterButton"
                        onClick={this.alertNotImplemented}>
                    Leave Group
                </button>
            </div>
        );
    }
});

var RequestToJoinButton = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        console.log("RequestToJoinButton:render, permissions = " + this.props.permissions);
        if (this.props.permissions != VolunteerGroup.PermissionsEnum.NONMEMBER)
            return null;
        return (
            <div>
                <button className="btn btn-warning requestToJoinButton"
                        onClick={this.alertNotImplemented}>
                    Request to Join
                </button>
            </div>
        );
    }
});

var ShelterActionsBox = React.createClass({
    render: function () {
        console.log("ShelterActionsBox:render:");
        var volunteer = this.props.user ? Volunteer.castObject(this.props.user) : null;
        var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
        var permissions = group.getUserPermissions(volunteer.id);
        return (
            <div>
                <LeaveShelterButton permissions={permissions}/>
                <RequestToJoinButton permissions={permissions} />
            </div>
        );
    }
});

module.exports = ShelterActionsBox;