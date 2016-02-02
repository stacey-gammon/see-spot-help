'use strict'

var React = require('react');

var ShelterActionsBox = React.createClass({
    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },
    render: function () {
        return (
            <div>
                <button className="btn btn-warning" onClick={this.alertNotImplemented}>Leave Group
                </button>
            </div>
        );
}
});

module.exports = ShelterActionsBox;