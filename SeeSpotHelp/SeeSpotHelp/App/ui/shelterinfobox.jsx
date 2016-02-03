'use strict'

var React = require('react');

var ShelterInfoBox = React.createClass({
    render: function () {
        console.log("ShelterInfoBox:render");
        return (
            <div className="shelterInfoBox">
                <h1>{this.props.group.name}</h1>
                <h2>{this.props.group.shelterName}</h2>
                <h2>{this.props.group.address}</h2>
            </div>
        );
    }
});

module.exports = ShelterInfoBox;
