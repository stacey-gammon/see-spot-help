"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Animal = require("../core/animal");
var DataServices = require('../core/dataservices');
var AnimalActions = require('../actions/animalactions');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class AnimalStore extends EventEmitter {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			console.log("AnimalStore:Dispatcher:register");
			outer.handleAction(action);
		});

		this.animals = {};
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	// @param {function} callback
	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	getAnimalById(animalId, groupId) {
		if (!this.animals.hasOwnProperty(groupId)) {
			// Prevent downloading twice.
			this.animals[groupId] = [];
			this.downloadAnimals(groupId);
			return null;
		}
		for (var i = 0; i <  this.animals[groupId].length; i++) {
			if (this.animals[groupId][i].id == animalId) {
				return this.animals[groupId][i];
			}
		}
		return null;
	}

	getAnimalsByGroupId(groupId) {
		if (!this.animals.hasOwnProperty(groupId)) {
			this.downloadAnimals(groupId);
			return null;
		}
		return this.animals[groupId];
	}

	animalAdded(snapshot) {
		if (snapshot.val()) {
			var animal = Animal.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!animal.id) return;
			if (!this.animals[animal.groupId]) {
				this.animals[animal.groupId] = [];
			}
			this.animals[animal.groupId].push(animal);

			// TODO: sort by latest activity
			// this.animals[animal.groupId].sort(function(a, b){
			//	 return a.timestamp < b.timestamp ? 1 : -1;
			// });
			AnimalActions.animalAdded(animal);
			this.emitChange();
		}
	}

	animalDeleted(snapshot) {
		var deletedAnimal = snapshot.val();
		var animals = this.animals[deletedAnimal.groupId];
		for (var i = 0; i < animals.length; i++) {
			if (animals[i].id == deletedAnimal.id) {
				this.animals[deletedAnimal.groupId].splice(i, 1);
				AnimalActions.animalDeleted(deletedAnimal);
				this.emitChange();
				return;
			}
		}
	}

	animalChanged(snapshot) {
		var changedAnimal = Animal.castObject(snapshot.val());
		var animals = this.animals[changedAnimal.groupId];
		for (var i = 0; i < animals.length; i++) {
			if (animals[i].id == changedAnimal.id) {
				animals[i] = changedAnimal;
				AnimalActions.animalChanged(changedAnimal);
				this.emitChange();
				return;
			}
		}
		// Must have been an update to a newly added animal id.
		this.animalAdded(snapshot);
	}

	downloadAnimals(groupId) {
		DataServices.OnMatchingChildAdded(
			"animals",
			"groupId",
			groupId,
			this.animalAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			"animals",
			"groupId",
			groupId,
			this.animalDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			"animals",
			"groupId",
			groupId,
			this.animalChanged.bind(this));
	}

	updateAnimalInfo(group) {
		console.log("updating animal info to match groups");
		var animals = this.animals[group.id];
		for (var i = 0; i < animals.length; i++) {
			animals[i].CopyGroupFields(group);
			animals[i].update();
		}
		this.emitChange();
	}

	handleAction(action) {
		switch (action.type) {
			case ActionConstants.GROUP_UPDATED:
				tthis.updateAnimalInfo(action.group);
				break;
		default:
			break;
		}
	}
}

module.exports = new AnimalStore();
