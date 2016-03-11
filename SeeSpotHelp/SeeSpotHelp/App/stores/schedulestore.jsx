"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var Schedule = require('../core/schedule');
var DataServices = require('../core/dataservices');

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class ScheduleStore extends EventEmitter {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			outer.handleAction(action);
		});
		this.scheduleIdsForAnimal = {};
		this.schedule = {};
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

	getScheduleByAnimalId(animalId) {
		var scheduleForAnimal = [];
		for (var i = 0; i <  this.scheduleIdsForAnimal[animalId].length; i++) {
			scheduleForAnimal.push(
				this.schedule[this.scheduleIdsForAnimal[animalId][i]];
			);
		}
		return scheduleForAnimal;
	}

	scheduleAdded(snapshot) {
		if (snapshot.val()) {
			var schedule = Schedule.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!schedule.id) return;
			if (!this.scheduleIndexByAnimalId[schedule.animalId]) {
				this.scheduleIndexByAnimalId[schedule.animalId] = [];
			}
			this.schedule[schedule.id] = schedule;
			this.scheduleIndexByAnimalId[schedule.animalId].push(schedule.id);

			this.emitChange();
		}
	}

	scheduleDeleted(snapshot) {
		var deletedSchedule = snapshot.val();
		delete this.schedule[deletedSchedule.id];
		for (var i = 0; i < this.scheduleIndexByAnimalId[deletedSchedule.animalId]; i++) {
			var animalSchedule = this.scheduleIndexByAnimalId[deletedSchedule.animalId][i];
			if (animalSchedule.id == deletedSchedule.id) {
				this.scheduleIndexByAnimalId[deletedSchedule.animalId].splice(i, 1);
				this.emitChange();
				return;
			}
		}
	}

	scheduleChanged(snapshot) {
		var changedSchedule = Schedule.castObject(snapshot.val());
		if (this.schedule.hasOwnProperty changedSchedule.id) {
			this.schedule[changedSchedule.id] = changedSchedule;
		} else {
			// Must have been an update to a newly added animal id.
			this.scheduleAdded(snapshot);
		}
	}

	downloadScheduleForAnimal(animalId) {
		// So we don't try to download it again if there is no schedule (e.g. differentiate from
		// null).
		this.scheduleIndexByAnimalId[animalId] = -1;

		DataServices.OnMatchingChildAdded(
			"schedule",
			"animalId",
			animalId,
			this.scheduleAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			"schedule",
			"animalId",
			animalId,
			this.scheduleAdded.bind(this));
		DataServices.OnMatchingChildChanged(
			"schedule",
			"animalId",
			animalId,
			this.scheduleAdded.bind(this));
	}

	handleAction(action) {
		switch (action.type) {
			default:
				break;
		}
	}
}

module.exports = new ScheduleStore();
