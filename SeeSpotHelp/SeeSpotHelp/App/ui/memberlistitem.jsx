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
        var user = this.props.user;
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
                user: VolunteerStore.getVolunteerById(this.props.user.id),
                group: GroupStore.getGroupById(group.id),
                permissions: group.getUserPermissions(user.id)
            });
    },

    render: function () {
        console.log("MemberListItem:render:");
        var group = VolunteerGroup.castObject(this.props.group);
        var permission = group.getUserPermissions(this.props.user.id);
        var adminText = permission == VolunteerGroup.PermissionsEnum.ADMIN ? "(admin)" : "";
        return (
            <a href="#" className="list-group-item memberListElement">
                <LinkContainer to={{ pathname: "memberHomePage" ,
                    state: { user: this.props.user} }}>
                    <div className="media">
                        <div className="media-body">
                            <h2>{this.props.user.name} {adminText}</h2>
                        </div>
                    </div>
                </LinkContainer>
            </a>
            );
    }
});

module.exports = MemberListItem;
