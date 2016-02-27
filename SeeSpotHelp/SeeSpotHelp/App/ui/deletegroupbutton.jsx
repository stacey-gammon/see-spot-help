"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../core/volunteergroup");
var Volunteer = require("../core/volunteer");
var ConstStrings = require("../core/conststrings");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");

var DeleteGroupButton = React.createClass({
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

    deleteGroup: function() {
        // TODO: warn the user first
        this.state.group.delete();
    },

    getDeleteGroupButton: function () {
        if (this.state.permissions != VolunteerGroup.PermissionsEnum.ADMIN) {
            return null;
        }
        return (<button className="btn btn-danger deleteShelterButton buttonPadding"
                        onClick={this.deleteGroup()}
                        ref="deleteShelterButton">
                    Delete
                </button>
        );
    },

    render: function () {
        console.log("DeleteGroupButton:render:");
        return (
            <div>
                {this.getDeleteGroupButton()}
            </div>
        );
    }
});

module.exports = DeleteGroupButton;
