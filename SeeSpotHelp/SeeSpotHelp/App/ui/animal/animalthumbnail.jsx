﻿"use strict"

var React = require("react");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
var AnimalThumbnail = React.createClass({
    //getInitialState: function () {
    //    var user = this.props.user;
    //    var group = this.props.group ? VolunteerGroup.castObject(this.props.group) : null;

    //    return {
    //        user: user,
    //        group: group
    //    };
    //},

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    loadAnimalHomePage: function() {
        this.context.router.push(
            {
                pathname: "animalHomePage",
                state: {
                    group: this.props.group,
                    user: this.props.user,
                    animal: this.props.animal
                }
            });
    },

    render: function () {
        var imageSrc = this.props.animal.photo || "images/dog.jpg";
        return (
            <a href="#" className="list-group-item animalListElement">
                <LinkContainer to={{ pathname: "animalHomePage" ,
                               state: { user: this.props.user, group: this.props.group, animal: this.props.animal} }}>
                    <div className="media">
                        <div className="media-left">
                            <img className="media-object" src={imageSrc} />
                        </div>
                        <div className="media-body">
                            <h4 className="media-heading">{this.props.animal.name}</h4>
                            <p className="animalThumbnailText">{this.props.animal.breed}</p>
                            <p className="animalThumbnailText">{this.props.animal.age} years old</p>
                        </div>
                    </div>
                </LinkContainer>
            </a>
        );
    }
});

module.exports = AnimalThumbnail;