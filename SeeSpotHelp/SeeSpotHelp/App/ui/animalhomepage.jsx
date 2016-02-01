'use strict'

var React = require('react');
var FakeData = require('../scripts/fakedata');
var AnimalActionsBox = require('./animalactionsbox');

var AnimalHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        var animal = null;
        if (query && query.animalId) {
            animal = FakeData.getFakeAnimalDataForGroup(query.groupId)[query.animalId];
        }
        if (animal) {
            return (
                <div>
                    <h1>{animal.name}</h1>
                    <h2>Age: {animal.age} years</h2>
                    <h2>Breed: {animal.breed}</h2>
                    Add photo here.
                    <AnimalActionsBox/>
                    Notes will go here.
                    {this.props.children}
                </div>
            );
        }
    }
});

module.exports = AnimalHomePage;