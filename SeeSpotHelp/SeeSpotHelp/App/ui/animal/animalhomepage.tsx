"use strict"

var React = require('react');
var ReactBootstrap = require("react-bootstrap");
var Tab = ReactBootstrap.Tab;
var Tabs = ReactBootstrap.Tabs;

import LoginStore from '../../stores/loginstore';

import Utils from '../../core/utils';
import Animal from '../../core/animal';
import VolunteerGroup from '../../core/volunteergroup';
import Permission from '../../core/permission';
import AnimalStore = require("../../stores/animalstore");
import PhotoStore from '../../stores/photostore';
import PermissionsStore from '../../stores/permissionsstore';

var AnimalActionsBox = require('./animalactionsbox');
var AnimalPhotoReel = require("./animalphotoreel");
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

		var permission = LoginStore.getUser() && group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, group.id) :
			Permission.CreateNonMemberPermission();

		if (animal && !(animal instanceof Animal)) {
			animal = animal.castObject(animal);
		}
		if (group && !(group instanceof VolunteerGroup)) {
			group = group.castObject(group);
		}

		var state = {
			animal: animal,
			group: group,
			permission: permission,
			animalDefaultTabKey: null
		};

		Utils.LoadOrSaveState(state);
		return state;
	},
	componentDidMount: function() {
		LoginStore.addChangeListener(this.onChange);
		PhotoStore.addChangeListener(this.onChange);
		PermissionsStore.addChangeListener(this.onChange);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this.onChange);
		PhotoStore.removeChangeListener(this.onChange);
		PermissionsStore.removeChangeListener(this.onChange);
	},

	onChange: function () {
		var permission = LoginStore.getUser() && this.state.group ?
			PermissionsStore.getPermission(LoginStore.getUser().id, this.state.group.id) :
			Permission.CreateNonMemberPermission();
		this.setState({
			permission: permission
		});
	},

	shouldAllowUserToEdit: function () {
		return this.state.permission.inGroup();
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
					state: { user: LoginStore.getUser(),
							 group: this.state.group,
							 animal: this.state.animal,
							 mode: 'edit' } }}>
				<span style={{marginLeft: '10px'}}
						className="glyphicon glyphicon-edit">
				</span>
			</LinkContainer>
		);
	},

	render: function () {
		if (!this.state.animal) return null;
		var photos = PhotoStore.getPhotosByAnimalId(this.state.animal.id);
		var imageSrc = photos && photos.length > 0 ? photos[0].src : this.state.animal.getDefaultPhoto();

		var animal = this.state.animal;
		var defaultTabKey = this.state.animalDefaultTabKey ? this.state.animalDefaultTabKey : 1;
		return (
			<div>
				<div className="media">
					<div className="media-left">
						<img className="media-object"
							 style={{margin: 5 + "px"}}
							 height="100px" width="100px"
							 src={imageSrc} />
					</div>
					<div className="media-body padding">
						<h1 className="animalInfo">{animal.name}
						{this.getEditIcon()}
						</h1>
						<h2 className="animalInfo">{animal.age} years old</h2>
						<h2 className="animalInfo">{animal.status}</h2>
						<h2 className="animalInfo">{animal.breed}</h2>
						<p className="animalInfo">{animal.description}</p>
					</div>
				</div>
				<AnimalPhotoReel group={this.state.group} animal={animal} />
							<Tabs activeKey={defaultTabKey} onSelect={this.handleTabSelect}>
							<Tab eventKey={1} title={Utils.getActivityGlyphicon()}>
								<AnimalActionsBox
									group={this.state.group}
									animal={animal}
									permission={this.state.permission}/>
								<br/>
								<br/>
								<AnimalActivityList
									group={this.state.group}
									animal={animal}
									permission={this.state.permission}/>
							</Tab>
							<Tab eventKey={2} title={Utils.getCalendarGlyphicon()}>
								<AnimalScheduleTab
									group={this.state.group}
									view="animal"
									animalId={animal.id}
									permission={this.state.permission}/>
							</Tab>
						</Tabs>
			</div>
		);
	}
});

module.exports = AnimalHomePage;
