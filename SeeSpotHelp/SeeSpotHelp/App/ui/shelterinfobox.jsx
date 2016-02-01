'use strict'

var React = require('react');

var ShelterInfoBox = React.createClass({
    render: function () {
        return (
            <div>
                    <h1>{this.props.group.name}</h1>
                    <h2>{this.props.group.shelterName} - {this.props.group.address}</h2>
                    <span>15 Volunteers</span>
                </div>
        );
    }
});

module.exports = ShelterInfoBox;
