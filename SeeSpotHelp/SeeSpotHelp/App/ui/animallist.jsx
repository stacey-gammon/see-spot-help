'use strict'

var React = require('react');
var AnimalThumbnail = require('./animalthumbnail');
var GroupStore = require("../stores/groupstore");

// A list of animals managed by the current volunteer group.
var AnimalList = React.createClass({
    generateAnimal: function (animal) {
        console.log("generateAnimal, animal = ");
        console.log(animal);
        return (
            <AnimalThumbnail animal={animal} group={this.props.group}/>
        );
    },

    render: function () {
        var animals = [];
        for (var key in this.props.group.animals) {
            console.log("key = " + key);
            if (this.props.group.animals.hasOwnProperty(key)) {
                animals.push(this.generateAnimal(this.props.group.animals[key]));
            }
        }
        return (
            <div className="container-fluid">
                {animals}
            </div>
        );
    }
});

module.exports = AnimalList;