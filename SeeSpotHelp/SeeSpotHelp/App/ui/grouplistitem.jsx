"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../core/volunteergroup");
var Volunteer = require("../core/volunteer");
var ConstStrings = require("../core/conststrings");
var LoginStore = require("../stores/loginstore");
var ShelterInfoBox = require("../ui/shelterinfobox");
var EditGroupButton = require("../ui/editgroupbutton");
var GroupStore = require("../stores/groupstore");

var GroupListItem = React.createClass({
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
        this.setState(
            {
                user: LoginStore.getUser(),
                group: GroupStore.getGroupById(group.id),
                permissions: group.getUserPermissions(user.id)
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
        console.log("GroupListItem:render:");
        var group = VolunteerGroup.castObject(this.props.group);
        console.log("group: ");
        console.log(group);
        var permission = group.getUserPermissions(this.props.user.id);
        var headerText = permission == VolunteerGroup.PermissionsEnum.ADMIN ?
            "Admin" : permission == VolunteerGroup.PermissionsEnum.MEMBER ?
            "Member" : permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ?
            "Membership Pending" : "";
        return (
            <a href="#" className="list-group-item animalListElement">
                <LinkContainer to={{ pathname: "shelterHomePage" ,
                    state: { user: this.props.user, group: group, animal: this.props.animal} }}>
                    <div className="media">
                        <div className="media-body">
                            <h2>-- {headerText} --</h2>
                            <ShelterInfoBox group={group}/>
                        </div>
                        <div className="media-right">
                            <EditGroupButton user={this.props.user} group={group}/>
                        </div>
                    </div>
                </LinkContainer>
            </a>
        );
    }
});

module.exports = GroupListItem;
