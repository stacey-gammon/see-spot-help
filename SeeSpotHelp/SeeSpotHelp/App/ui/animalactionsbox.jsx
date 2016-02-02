'use strict'

var React = require('react');

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
    getInitialState() {
        return {walking: false}
    },

    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },

    endWalk: function() {
        var startWalk = this.state.startWalkTime;
        var totalWalkTimeInMinutes = (Date.now() - startWalk) / (1000 * 60);
        this.setState({ walking: false });

        // TODO(stacey): Temporary, implement this feature fully.
        console.log("You walked the dog for " + totalWalkTimeInMinutes + " minutes");
    },

    startWalk: function() {
        this.setState({walking: true, startWalkTime: Date.now() });
        var walkButton = document.getElementById('walkButton');
        walkButton.text = "End Walk";
        walkButton.onClick = this.endWalk;
    },

    render: function () {
        var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
        var walkText = this.state.walking ? "End walk" : "Walk";
        return (
            <div>
                <button className="btn btn-info" id="walkButton" onClick={walkFunction}>
                    {walkText}
                </button>
                <button className="btn btn-info">
                    Add Note
                </button>
                <button className="btn btn-info" onClick={this.alertNotImplemented}>
                    Edit
                </button>
                <button className="btn btn-warning" onClick={this.alertNotImplemented}>
                    <span className="glyphicon glyphicon-trash"></span>
                </button>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;