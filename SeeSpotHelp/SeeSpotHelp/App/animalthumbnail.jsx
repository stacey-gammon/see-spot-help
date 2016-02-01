'use strict'

var React = require('react');

var AnimalThumbnail = React.createClass({
    render: function () {
        return (
            <div>
                {this.props.animalName}
            </div>
        );
    }
});

module.exports = AnimalThumbnail;