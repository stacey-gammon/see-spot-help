'use strict'

var React = require('react');
var AnimalThumbnail = require('./animalthumbnail');

var AnimalGroup = React.createClass({
    generateAnimal: function (animal) {
        return (
            <AnimalThumbnail animal={animal} groupId={this.props.groupId}/>
        );
    },

    render: function () {
        var animals = [];
        for (var key in this.props.animals) {
            if (this.props.animals.hasOwnProperty(key)) {
                animals.push(this.generateAnimal(this.props.animals[key]));
            }
        }
        return (
            <div>
                {animals}
            </div>
        );
    }
});

module.exports = AnimalGroup;