"use strict"

var React = require('react');
var LoginStore = require("../../stores/loginstore");
var Animal = require("../../core/animal");
var VolunteerGroup = require("../../core/volunteergroup");
var AnimalActionsBox = require('./animalactionsbox');
var AnimalPhotoReel = require("./animalphotoreel");
var AnimalStore = require("../../stores/animalstore");
var AnimalActivityList = require("./animalactivitylist");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
var AnimalHomePage = React.createClass({
	getInitialState: function() {
		var animal = this.props.location &&
					 this.props.location.state &&
					 this.props.location.state.animal ||
					 this.props.animal;
		var group = this.props.location &&
					this.props.location.state &&
					this.props.location.state.group ||
					this.props.group;

		if (animal && !(animal instanceof Animal)) {
			animal = Animal.castObject(animal);
		}
		if (group && !(group instanceof VolunteerGroup)) {
			group = VolunteerGroup.castObject(group);
		}

		var state = {
			animal: animal,
			group: group,
			user: LoginStore.user
		};
		Utils.LoadOrStateState(state);
		return state;
	},

	shouldAllowUserToEdit: function () {
		if (!this.state.user) return false;
		var edit = this.state.group.shouldAllowUserToEdit(this.state.user.id);
		return edit;
	},

	render: function () {
		var imageSrc = this.state.animal.getPhoto();
		var animal = this.state.animal;
		if (animal) {
			return (
				<div>
					<div className="media">
						<div className="media-left">
							<img className="media-object"
								 style={{margin: 5 + "px"}}
								 src={imageSrc} />
						</div>
						<div className="media-body padding">
							<h1 className="animalInfo">{animal.name}</h1>
							<h2 className="animalInfo">{animal.age} years old</h2>
							<h2 className="animalInfo">{animal.breed}</h2>
							<p className="animalInfo">{animal.description}</p>
						</div>
						<div className="media-right">
							<LinkContainer
								disabled={!this.shouldAllowUserToEdit()}
								to={{ pathname: "addAnimalPage",
									state: { user: this.state.user,
											 group: this.state.group,
											 animal: this.state.animal,
											 editMode: true } }}>
								<button className="btn btn-info buttonPadding editAnimalButton"
										disabled={!this.shouldAllowUserToEdit()}>
									Edit
								</button>
							</LinkContainer>
						</div>
					</div>
					<AnimalPhotoReel group={this.state.group}
									 user={this.state.user} animal={animal} />
					<AnimalActionsBox group={this.state.group}
									  user={this.state.user}
									  style={{margin: 10 + 'px'}}
									  animal={animal}/>
					<AnimalActivityList user={this.state.user}
										group={this.state.group}
										animal={animal} />
				</div>
			);
		} else {
			return (<div/>);
		}
	}
});

module.exports = AnimalHomePage;
