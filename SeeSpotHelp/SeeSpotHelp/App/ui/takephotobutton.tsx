'use strict'

var React = require("react");

import DataServices from '../core/dataservices';
import Photo from '../core/databaseobjects/photo';
import PhotoActivity from '../core/databaseobjects/photoactivity';
import LoginStore from '../stores/loginstore';

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
		this.forceUpdate();
	},

	uploadSucceeded: function() {
		alert("yay!");
	},

	uploadFailed: function(error) {
		alert("boo!" + error.responseText);
	},

	uploadFile: function (file) {
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {
				var filePayload = e.target.result;
				// Generate a location that can't be guessed using the file's contents and a random number
				var hash = CryptoJS.SHA256(Math.random() + '' + CryptoJS.SHA256(filePayload));
				var photo = new Photo();
				photo.id = '' + hash;
				photo.src = filePayload;
				photo.animalId = this.props.animal.id;
				photo.groupId = this.props.animal.groupId;
				photo.userId = LoginStore.getUser().id;
				photo.insert();

				var activity = new PhotoActivity(photo, LoginStore.getUser());
				activity.insert();
			}.bind(this);
		}.bind(this))(file);
		reader.readAsDataURL(file);
	},

	loadPhoto: function() {
		var file = this.refs.addPhotoFileInput.files[0];
		this.uploadFile(file);
   },

	addPhoto: function() {
		this.refs.addPhotoFileInput.click();
	},

	allowAction: function() {
		return this.props.permission.inGroup();
	},

	render: function () {
		return (
			<span>
				<button className="btn btn-info"
						disabled={!this.allowAction()}
						onClick={this.addPhoto}
						style={this.props.style}>
					<span className="glyphicon glyphicon-camera"></span>
				</button>
				<input type="file" accept="image/*"
						onChange={this.loadPhoto}
						className="addPhotoFileInput"
						ref="addPhotoFileInput"/>
			</span>
		);
	}
});

module.exports = TakePhotoButton;
