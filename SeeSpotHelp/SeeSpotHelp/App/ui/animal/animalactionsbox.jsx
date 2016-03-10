"use strict"

var React = require("react");
var AjaxServices = require("../../core/dataservices");
var TakePhotoButton = require("../takephotobutton");
var LoginStore = require("../../stores/loginstore");
var VolunteerGroup = require("../../core/volunteergroup");
var AddAnimalNote = require("./addanimalnote");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
	getInitialState: function() {
		return {
			walking: false,
			user: LoginStore.getUser(),
			animal: this.props.animal,
			group: VolunteerGroup.castObject(this.props.group)
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

	shouldAllowUserToEdit: function () {
		if (!LoginStore.getUser()) return false;
		var edit = this.state.group.shouldAllowUserToEdit(LoginStore.getUser().id);
		return edit;
	},

	render: function () {
		console.log("AnimalActionsBox::render with groupo::");
		console.log(this.state.group);
		var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
		var walkText = this.state.walking ? "End walk" : "Walk";
		return (
			<div>
				<LinkContainer
					disabled={!this.shouldAllowUserToEdit()}
					to={{ pathname: "addAnimalNote",
						state: { user: this.state.user,
								 animal: this.props.animal,
								 group: this.state.group,
								 editMode: false } }}>
					<button className="btn btn-info padding addAnimalNoteButton"
							disabled={!this.shouldAllowUserToEdit()}>
						Post
					</button>
				</LinkContainer>
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
				<button className="btn btn-info padding"
						disabled={!this.shouldAllowUserToEdit()}
						onClick={this.alertNotImplemented}>
					Schedule
				</button>
			</div>
		);
	}
});

module.exports = AnimalActionsBox;
