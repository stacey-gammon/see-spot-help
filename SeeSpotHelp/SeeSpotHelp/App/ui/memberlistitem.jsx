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
var VolunteerStore = require("../stores/volunteerstore");

var MemberListItem = React.createClass({
    getInitialState: function() {
        var member = this.props.member
        var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;

        return {
            user: LoginStore.getUser(),
            member: member,
            group: group
        };
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
        VolunteerStore.removeChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
        VolunteerStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                member: VolunteerStore.getVolunteerById(this.props.member.id),
                group: GroupStore.getGroupById(group.id)
            });
    },

    approveMembership: function () {
        this.state.group.updateMembership(this.props.member, VolunteerGroup.PermissionsEnum.MEMBER);
    },

    denyMembership: function () {
        this.state.group.updateMembership(this.props.member, VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED);
    },

    getApproveMembershipButton: function() {
        var group = VolunteerGroup.castObject(this.props.group);
        var permission = group.getUserPermissions(this.props.member.id);
        var text = permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ? "Approve" :
            permission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED ? "Re-approve" : "";
        if (text != "") {
            return (
                <div>
                <button className="btn btn-primary" onClick={this.approveMembership }>{text}</button>
                </div>
            );
        } else {
            return null;
        }
    },

    getBootMembershipButton: function() {
        var group = VolunteerGroup.castObject(this.props.group);
        var permission = group.getUserPermissions(this.props.member.id);
        var text = permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ? "Deny" : "Boot";
        if (permission != VolunteerGroup.PermissionsEnum.ADMIN &&
            permission != VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
            return (
                <div>
                <button className="btn btn-warning" onClick={this.denyMembership }>{text}</button>
                </div>
            );
        } else {
            return null;
        }
    },

    getActions: function () {
        var group = VolunteerGroup.castObject(this.props.group);
        if (group.getUserPermissions(this.state.user.id) == VolunteerGroup.PermissionsEnum.ADMIN) {
            return (
                <div className="media-right">
                    {this.getApproveMembershipButton()}
                    {this.getBootMembershipButton()}
                </div>
            );
        } else {
            return null;
        }
    },

    render: function () {
        console.log("MemberListItem:render:");
        var group = VolunteerGroup.castObject(this.props.group);
        var permission = group.getUserPermissions(this.props.member.id);

        var className = "list-group-item memberListElement";
        // TODO: Give admins a way to view previously booted or denied members so they have a
        // chance to re-add (but hide by default).
        if (permission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
            className += " membershipRevokedStyle";
        }

        var extraInfo = permission == VolunteerGroup.PermissionsEnum.ADMIN ? "(admin)" : "";
        if (group.getUserPermissions(this.state.user.id) == VolunteerGroup.PermissionsEnum.ADMIN) {
            extraInfo = permission == VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP ? "(membership pending)" :
                permission == VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED ? "(membership denied)" : extraInfo;
        }
        return (
            <a href="#" className={className}>
                <LinkContainer to={{ pathname: "memberHomePage" ,
                    state: { member: this.props.member} }}>
                    <div className="media">
                        <div className="media-body">
                            <h2>{this.props.member.name} {extraInfo}</h2>
                        </div>
                        {this.getActions()}
                    </div>
                </LinkContainer>
            </a>
            );
    }
});

module.exports = MemberListItem;
