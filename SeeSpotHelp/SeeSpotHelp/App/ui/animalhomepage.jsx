'use strict'

var React = require('react');
var FakeData = require('../core/fakedata');
var AnimalActionsBox = require('./animalactionsbox');

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
var AnimalHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        var animal = null;
        if (query && query.animalId) {
            animal = FakeData.getFakeAnimalDataForGroup(query.groupId)[query.animalId];
        }
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
                        <AnimalActionsBox/>
                </div>
            );
        }
    }
});

module.exports = AnimalHomePage;