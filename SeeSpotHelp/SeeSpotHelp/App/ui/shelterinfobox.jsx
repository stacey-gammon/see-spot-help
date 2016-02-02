'use strict'

var React = require('react');

var ShelterInfoBox = React.createClass({
    render: function () {
        return (
            <div>
                <h1>{this.props.group.name}</h1>
                <h2>{this.props.group.shelterName}</h2>
                <h2>{this.props.group.address}</h2>
            </div>
        );
    }
});

module.exports = ShelterInfoBox;
