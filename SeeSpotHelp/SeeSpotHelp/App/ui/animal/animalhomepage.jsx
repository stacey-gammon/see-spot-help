"use strict"

var React = require('react');
var LoginStore = require("../../stores/loginstore");
var Animal = require("../../core/animal");
var VolunteerGroup = require("../../core/volunteergroup");
var AnimalActionsBox = require('./animalactionsbox');
var AnimalPhotoReel = require("./animalphotoreel");
var AnimalActivityList = require("./animalactivitylist");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
var AnimalHomePage = React.createClass({
    getInitialState: function() {
        var animal = this.props.location &&
                     this.props.location.state &&
                     this.props.location.state.animal ||
                     this.props.animal;
        var group = this.props.location &&
                    this.props.location.state &&
                    this.props.location.state.group ||
                    this.props.group;

        if (animal && !(animal instanceof Animal)) {
            animal = Animal.castObject(animal);
        }
        if (group && !(group instanceof VolunteerGroup)) {
            group = VolunteerGroup.castObject(group);
        }
        return {
            animal: animal,
            group: group,
            user: LoginStore.getUser()
        };
    },

    shouldAllowUserToEdit: function () {
        var edit = this.state.group.shouldAllowUserToEdit(this.state.user.id);
        console.log("allow edit? " + edit);
        return edit;
    },

    render: function () {
        console.log("AnimalHomePage:render: ");
        console.log(this.state.animal);
        var imageSrc = this.state.animal.photo || "images/dog.jpg";
        var animal = this.state.animal;
        if (animal) {
            return (
                <div>
                    <div className="media">
                        <div className="media-left">
                            <img className="media-object" src={imageSrc} />
                        </div>
                        <div className="media-body">
                            <h1 className="animalInfo">{animal.name}</h1>
                            <h2 className="animalInfo">{animal.age} years old</h2>
                            <h2 className="animalInfo">{animal.breed}</h2>
                        </div>
                        <div className="media-right">
                            <LinkContainer
                                to={{ pathname: "addAnimalPage",
                                    state: { user: this.state.user,
                                             group: this.state.group,
                                             animal: this.state.animal,
                                             editMode: true } }}>
                                <button className="btn btn-info buttonPadding editAnimalButton"
                                        disabled={!this.shouldAllowUserToEdit()}>
                                    Edit
                                </button>
                            </LinkContainer>
                        </div>
                    </div>
                    <AnimalPhotoReel group={this.state.group}
                                     user={this.state.user} animal={animal} />
                                 <AnimalActionsBox group={this.state.group}
                                      user={this.state.user}
                                      animal={animal}/>
                    <AnimalActivityList user={this.state.user}
                                        group={this.state.group}
                                        animal={animal} />
                </div>
            );
        } else {
            return (<div/>);
        }
    }
});

module.exports = AnimalHomePage;
