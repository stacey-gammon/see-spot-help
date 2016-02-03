"use strict"

var React = require("react");

var AddNewShelter = React.createClass({
    render: function () {
        if (this.props.user) {
            return (
                <div>
                    <h1>Add New Group</h1>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>You need to log in to be able to add a new group.</h1>
                </div>
            );
        }
    }
});

module.exports = AddNewShelter;
