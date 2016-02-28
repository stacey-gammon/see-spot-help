"use strict"

var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var TextArea = ReactBootstrap.textarea;
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var VolunteerGroup = require("../../core/volunteergroup");
var Volunteer = require("../../core/volunteer");
var AnimalNote = require("../../core/animalnote");
var ConstStrings = require("../../core/conststrings");
var LoginStore = require("../../stores/loginstore");
var GroupStore = require("../../stores/groupstore");
var AnimalActions = require("../../actions/animalactions");

var AddAnimalNote = React.createClass({
    getInitialState: function() {
        var editMode = this.props.editMode ? this.props.editMode :
            this.props.location ? this.props.location.state.editMode : null;
        var animal = this.props.animal ? this.props.animal :
            this.props.location ? this.props.location.state.animal : null;
        var group = this.props.animal ? this.props.group :
            this.props.location ? this.props.location.state.group : null;

        var user = LoginStore.getUser();
        return {
            user: user,
            animal: animal,
            editMode: editMode,
            group: group
        };
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
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

    submitNote: function () {
        var note = new AnimalNote(this.refs.note.value, this.state.animal.id, this.state.user.id);
        note.insert();
        AnimalActions.animalActivityAdded(note);
        this.context.router.push(
            {
                pathname: "animalHomePage",
                state: {
                    group: this.state.group,
                    animal: this.state.animal,
                    user: this.state.user
                }
            });
    },

    render: function () {
        console.log("AddAnimalNote:render:");
        return (
            <div>
                <textarea className="form-control" ref="note" rows="5" id="comment"/>
                <button className="btn btn-primary" onClick={this.submitNote}>
                    Post
                </button>
            </div>
        );
    }
});

module.exports = AddAnimalNote;
