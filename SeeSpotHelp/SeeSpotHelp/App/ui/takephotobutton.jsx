"use strict"

var React = require("react");
var AjaxServices = require("../core/AJAXServices");

var TakePhotoButton = React.createClass({
    uploadSucceeded: function() {
        alert("yay!");
    },
    uploadFailed: function(error) {
        alert("boo!" + error.responseText);
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
        console.log("TakePhotoButton::render");
        return (
            <div className="takePhotoButton" >
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

module.exports = TakePhotoButton;
