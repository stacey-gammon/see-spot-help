"use strict"

var React = require('react');
var FakeData = require('../core/fakedata');
var AnimalActionsBox = require('./animalactionsbox');

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
        return {
            animal: animal,
            group: group
        };
    },

    render: function () {
        console.log("AnimalHomePage:render: ");
        console.log(this.state.animal);
        var animal = this.state.animal;
        if (animal) {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6">
                            <img className="img-rounded img-responsive animalImg" src={animal.photo} />
                        </div>
                        <div className="col-xs-6">
                            <h1 className="animalInfo">{animal.name}</h1>
                            <h2 className="animalInfo">{animal.age} years old</h2>
                            <h2 className="animalInfo">{animal.breed}</h2>
                        </div>
                    </div>
                    <AnimalActionsBox group={this.state.group} animal={animal}/>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
});

module.exports = AnimalHomePage;