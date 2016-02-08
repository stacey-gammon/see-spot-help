"use strict"

var React = require("react");
var AjaxServices = require("../scripts/AJAXServices");
var TakePhotoButton = require("./takephotobutton")

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
         console.log("AnimalActionsBox::render");
        var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
        var walkText = this.state.walking ? "End walk" : "Walk";
        return (
            <div>
                <button className="btn btn-info buttonPadding" id="walkButton" onClick={walkFunction}>
                    {walkText}
                </button>
                <button className="btn btn-info buttonPadding">
                    Add Note
                </button>
                <button className="btn btn-info buttonPadding" onClick={this.alertNotImplemented}>
                    Edit
                </button>
                <TakePhotoButton user={this.state.user} group={this.state.group} animal={this.state.animal}/>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;