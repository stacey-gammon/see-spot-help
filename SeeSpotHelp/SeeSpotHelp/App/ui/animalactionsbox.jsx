'use strict'

var React = require('react');

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        return (
            <div>
                <button className="btn" onClick={this.alertNotImplemented}>
                    <span className="glyphicon glyphicon-plus-sign"></span>
                </button>
                <button className="btn" onClick={this.alertNotImplemented}>
                    <span className="glyphicon glyphicon-edit"></span>
                </button>
                <button className="btn" onClick={this.alertNotImplemented}>
                    <span className="glyphicon glyphicon-trash"></span>
                </button>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;