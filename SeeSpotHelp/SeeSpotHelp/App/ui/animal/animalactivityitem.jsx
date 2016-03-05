"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var VolunteerStore = require("../../stores/volunteerstore");
var AnimalActivityStore = require("../../stores/animalactivitystore");
var AnimalNote = require("../../core/animalnote");
var AnimalActions = require("../../actions/animalactions");

var AnimalActivityItem = React.createClass({
    getInitialState: function() {
        var member = this.props.member
        var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;
        return {
            user: LoginStore.getUser(),
            group: group
        };
    },

    deleteAction: function (event) {
        this.props.activity.delete();
        AnimalActions.animalActivityDeleted();
    },

    getEditActionButton: function() {
        return (
            <div>
                <LinkContainer
                    to={{ pathname: "addAnimalNote",
                        state: { user: this.state.user,
                                 animal: this.props.animal,
                                 activity: this.props.activity,
                                 group: this.props.group,
                                 editMode: true } }}>
                    <button className="btn btn-info">
                        Edit
                    </button>
                </LinkContainer>
            </div>
        );
    },

    getDeleteActionButton: function() {
        return (
            <div>
                <button className="btn btn-danger" onClick={this.deleteAction}>
                    <span className="glyphicon glyphicon-remove-circle"/>
                </button>
            </div>
        );
    },

    getActions: function () {
        if (this.props.activity.byUserId == this.state.user.id) {
            return (
                <div className="media-right">
                    {this.getEditActionButton()}
                    {this.getDeleteActionButton()}
                </div>
            );
        } else if (this.state.group.getUserPermissions(this.state.user.id)){
            return (
                <div className="media-right">
                    {this.getDeleteActionButton()}
                </div>
            );
        } else {
            return null;
        }
    },

    getAnimalNameHeader: function() {
        if (this.props.showAnimalInfo) {
            var animalName =
                this.state.group.animals[this.props.activity.animalId].name;
            return (
                <h4>{animalName}</h4>
            );
        } else {
            return null;
        }
    },

    render: function () {
        console.log("AnimalActivityItem:render:");
        var member = VolunteerStore.getVolunteerById(this.props.activity.byUserId);
        var userName = member ? member.name : "...loading";
        var date = this.props.activity.getDateForDisplay();
        var userAndDateInfo = " - " + userName + " - " + date;
        return (
            <a className="list-group-item">
                <div className="media">
                    <div className="media-body">
                        {this.getAnimalNameHeader()}
                        <p>{this.props.activity.toDisplayString()}</p>
                        <p>{userAndDateInfo}</p>
                    </div>
                    {this.getActions()}
                </div>
            </a>
        );
    }
});

module.exports = AnimalActivityItem;
