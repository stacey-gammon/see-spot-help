"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../core/volunteergroup");
var Volunteer = require("../core/volunteer");
var ConstStrings = require("../core/conststrings");
var LoginStore = require("../stores/loginstore");
var GroupStore = require("../stores/groupstore");

var EditGroupButton = React.createClass({
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

    render: function () {
        console.log("EditGroupButton:render:");
        return (
            <div>
                {this.getEditGroupButton()}
            </div>
        );
    }
});

module.exports = EditGroupButton;
