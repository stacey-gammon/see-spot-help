"use strict"

var React = require("react");
var AjaxServices = require("../core/dataservices");
var LoginStore = require("../stores/loginstore");

var TakePhotoButton = React.createClass({
	getInitialState: function() {
		return {
			user: LoginStore.getUser()
		}
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		this.setState(
			{
				user: LoginStore.user
			});
	},

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
		var file = this.refs.addPhotoFileInput.files[0];
		this.uploadFile(file);
   },

	addPhoto: function() {
		this.refs.addPhotoFileInput.click();
	},

	allowAction: function() {
		if (!LoginStore.user || !this.props.group) return false;
		return this.props.group.shouldAllowUserToEdit(LoginStore.user.id);
	},

	render: function () {
		console.log("TakePhotoButton::render");
		return (
			<div className="takePhotoButton" >
				<button className="btn btn-info padding"
						disabled={!this.allowAction()}
						onClick={this.addPhoto}
						style={{padding: '8px 4px 8px 12px'}}>
					<span className="glyphicon glyphicon-camera"
						style={{color: 'white', marginRight: '10px'}}></span>
				</button>
				<input type="file" accept="image/*"
					   onChange={this.loadPhoto}
					   className="addPhotoFileInput" ref="addPhotoFileInput"/>
			</div>
		);
	}
});

module.exports = TakePhotoButton;
