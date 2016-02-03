"use strict"

var React = require("react");
var VolunteerGroup = require("../scripts/volunteergroup");
var Volunteer = require("../scripts/volunteer");

var LeaveShelterButton = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        if (this.props.permissions == VolunteerGroup.PermissionsEnum.NONMEMBER)
            return null;
        return (
            <div>
                <button className="btn btn-warning" onClick={this.alertNotImplemented}>
                    Leave Group
                </button>
            </div>
        );
    }
});

var ShelterActionsBox = React.createClass({
    render: function () {
        var volunteer = this.props.user ? new Volunteer(this.props.user) : null;
        var group = this.props.group ? new VolunteerGroup(this.props.group) : null;
        var permissions = group.getUserPermissions(volunteer.id);
        return (
            <div>
                <LeaveShelterButton permissions={permissions}/>
            </div>
        );
    }
});

module.exports = ShelterActionsBox;