"use strict"

var React = require('react');
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

var LoginStore = require("../../stores/loginstore");

var Utils = require("../../core/utils");
var Animal = require("../../core/animal");
var VolunteerGroup = require("../../core/volunteergroup");
var AnimalActionsBox = require('./animalactionsbox');
var AnimalPhotoReel = require("./animalphotoreel");
var AnimalStore = require("../../stores/animalstore");
var AnimalActivityList = require("./animalactivitylist");
var AnimalScheduleTab = require("./animalscheduletab");
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
var AnimalHomePage = React.createClass({
	getInitialState: function() {
		var animal = Utils.FindPassedInProperty(this, 'animal');
		var group = Utils.FindPassedInProperty(this, 'group');

		if (animal && !(animal instanceof Animal)) {
			animal = Animal.castObject(animal);
		}
		if (group && !(group instanceof VolunteerGroup)) {
			group = VolunteerGroup.castObject(group);
		}

		var state = {
			animal: animal,
			group: group,
			user: LoginStore.user,
			animalDefaultTabKey: null
		};

		Utils.LoadOrSaveState(state);
		return state;
	},

	shouldAllowUserToEdit: function () {
		if (!LoginStore.user) return false;
		return this.state.group.shouldAllowUserToEdit(LoginStore.user.id);
	},

	handleTabSelect: function(key) {
		this.setState({animalDefaultTabKey : key});
		// We aren't supposed to manipulate state directly, but it doesn't yet have the newly
		// selected tab that we want to save to local storage.
		var stateDuplicate = this.state;
		stateDuplicate.animalDefaultTabKey = key;
		Utils.LoadOrSaveState(stateDuplicate);
	},

	getEditIcon: function() {
		if (!this.shouldAllowUserToEdit()) return null;
		return (
			<LinkContainer
				to={{ pathname: "addAnimalPage",
					state: { user: LoginStore.user,
							 group: this.state.group,
							 animal: this.state.animal,
							 editMode: true } }}>
				<span style={{marginLeft: '10px'}}
						className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	},

	render: function () {
		if (!this.state.animal) return null;
		var imageSrc = this.state.animal.getPhoto();
		var animal = this.state.animal;
		var defaultTabKey = this.state.animalDefaultTabKey ? this.state.animalDefaultTabKey : 1;
		return (
			<div>
				<div className="media">
					<div className="media-left">
						<img className="media-object"
							 style={{margin: 5 + "px"}}
							 src={imageSrc} />
					</div>
					<div className="media-body padding">
						<h1 className="animalInfo">{animal.name}
						{this.getEditIcon()}
						</h1>
						<h2 className="animalInfo">{animal.age} years old</h2>
						<h2 className="animalInfo">{animal.breed}</h2>
						<p className="animalInfo">{animal.description}</p>
					</div>
				</div>
				<AnimalPhotoReel group={this.state.group} animal={animal} />
				<AnimalActionsBox group={this.state.group} style={{margin: 10 + 'px'}}
					animal={animal}/>
							<Tabs activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
							<Tab eventKey={1} title="Activity">
								<AnimalActivityList group={this.state.group} animal={animal}/>
							</Tab>
							<Tab eventKey={2} title="Schedule">
								<AnimalScheduleTab group={this.state.group} animal={animal}/>
							</Tab>
						</Tabs>
			</div>
		);
	}
});

module.exports = AnimalHomePage;
