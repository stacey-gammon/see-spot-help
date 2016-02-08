"use strict"

var React = require("react");
var AjaxServices = require("../scripts/AJAXServices");

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

    uploadSucceeded: function() {
        alert("yay!");
    },
    uploadFailed: function() {
        alert("boo!");
    },

     uploadFile: function (file) {
         console.log("AnimalActionsBox::uploadFile");
         var ajax = new AjaxServices(this.uploadSucceeded,
                                     this.uploadFailed);
         console.log("file = ");
         console.log(file);
         ajax.callFileUploadService(
             "../../WebServices/imageServices.asmx",
             "saveImageFile",
             file);
    },

     loadPhoto: function() {
         console.log("AnimalActionsBox::LoadPhoto");
        var file = this.refs.addPhotoFileInput.files[0];
        this.uploadFile(file);
    },

    addPhoto: function() {
         console.log("AnimalActionsBox::addPhoto");
        this.refs.addPhotoFileInput.click();
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
                <button className="btn btn-info buttonPadding" onClick={this.addPhoto}>
                    <span className="glyphicon glyphicon-camera"></span>
                </button>
                <input type="file" accept="image/*"
                       onChange={this.loadPhoto}
                       className="addPhotoFileInput" ref="addPhotoFileInput"/>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;