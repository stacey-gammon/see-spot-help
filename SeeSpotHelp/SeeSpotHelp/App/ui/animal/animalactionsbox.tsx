"use strict"

var React = require("react");

import Permission = require("../../core/permission");
import LoginStore = require("../../stores/loginstore");
import PermissionsStore = require("../../stores/permissionsstore");
import VolunteerGroup = require("../../core/volunteergroup");

var TakePhotoButton = require("../takephotobutton");
var AddAnimalNote = require("./addanimalnote");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
	getInitialState: function() {
		var permission = LoginStore.getUser() && this.props.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.props.group.id) :
			Permission.CreateNonMemberPermission();
		return {
			walking: false,
			animal: this.props.animal,
			group: VolunteerGroup.castObject(this.props.group),
			permission: permission
		}
	},

	componentDidMount: function () {
		LoginStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function () {
		LoginStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var permission = LoginStore.getUser() && this.props.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.props.group.id) :
			Permission.CreateNonMemberPermission();
		this.setState({
			permission: permission
		});
	},

	// endWalk: function() {
	// 	var startWalk = this.state.startWalkTime;
	// 	var totalWalkTimeInMinutes = (Date.now() - startWalk) / (1000 * 60);
	// 	this.setState({ walking: false });
	//
	// 	// TODO(stacey): Temporary, implement this feature fully.
	// 	console.log("You walked the dog for " + totalWalkTimeInMinutes + " minutes");
	// },
	//
	// startWalk: function() {
	// 	this.setState({walking: true, startWalkTime: Date.now() });
	// 	var walkButton = document.getElementById('walkButton');
	// 	walkButton.text = "End Walk";
	// 	walkButton.onClick = this.endWalk;
	// },

	shouldAllowUserToEdit: function () {
		return this.state.permission.inGroup();
	},

	// Currently not called bc they are not implemented yet.
	getWalkAndVisitButtons: function () {
		return (
			<div>
			<button className="btn btn-info padding walkAnimalButton"
					id="walkButton"
					disabled={!this.shouldAllowUserToEdit()}
					onClick={this.walkFunction}>
				Walk
			</button>
			<button className="btn btn-info padding"
					disabled={!this.shouldAllowUserToEdit()}
					onClick={this.alertNotImplemented}>
				Visit
			</button>
			</div>
		);
	},

	render: function () {
		var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
		var walkText = this.state.walking ? "End walk" : "Walk";
		return (
			<div>
				<LinkContainer
					disabled={!this.shouldAllowUserToEdit()}
					to={{ pathname: "addAnimalNote",
						state: { animal: this.props.animal,
								 group: this.state.group,
								 mode: 'add' } }}>
					<button className="btn btn-info padding addAnimalNoteButton"
							disabled={!this.shouldAllowUserToEdit()}>
						Add a comment
					</button>
				</LinkContainer>
			</div>
		);
	}
});

module.exports = AnimalActionsBox;
