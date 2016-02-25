"use strict"

var React = require("react");
var AjaxServices = require("../core/AJAXServices");
var TakePhotoButton = require("./takephotobutton");
var LoginStore = require("../stores/loginstore");
var VolunteerGroup = require("../core/volunteergroup");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
    getInitialState: function() {
        return {
            walking: false,
            user: LoginStore.user,
            animal: this.props.animal,
            group: VolunteerGroup.castObject(this.props.group)
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user
            });
    },

    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },

    endWalk: function() {
        var startWalk = this.state.startWalkTime;
        var totalWalkTimeInMinutes = (Date.now() - startWalk) / (1000 * 60);
        this.setState({ walking: false });

        // TODO(stacey): Temporary, implement this feature fully.
        console.log("You walked the dog for " + totalWalkTimeInMinutes + " minutes");
    },

    startWalk: function() {
        this.setState({walking: true, startWalkTime: Date.now() });
        var walkButton = document.getElementById('walkButton');
        walkButton.text = "End Walk";
        walkButton.onClick = this.endWalk;
    },

    shouldAllowUserToEdit: function () {
        var edit = this.state.group.shouldAllowUserToEdit(this.state.user.id);
        console.log("allow edit? " + edit);
        return edit;
    },

    render: function () {
        console.log("AnimalActionsBox::render with groupo::");
        console.log(this.state.group);
        var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
        var walkText = this.state.walking ? "End walk" : "Walk";
        return (
            <div>
                <button className="btn btn-info buttonPadding walkAnimalButton"
                        id="walkButton"
                        disabled={!this.shouldAllowUserToEdit()}
                        onClick={walkFunction}>
                    {walkText}
                </button>
                <button className="btn btn-info buttonPadding addAnimalNoteButton"
                        disabled={!this.shouldAllowUserToEdit()}>
                    Add Note
                </button>
                <LinkContainer to={{ pathname: "addAdoptablePage",
                        state: { user: this.state.user, group: this.state.group, animal: this.state.animal, editMode: true } }}>
                    <button className="btn btn-info buttonPadding editAnimalButton"
                            disabled={!this.shouldAllowUserToEdit()}>
                        Edit
                    </button>
                </LinkContainer>
                <TakePhotoButton className="takePhotoButton"
                                 group={this.state.group}
                                 animal={this.state.animal}/>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;