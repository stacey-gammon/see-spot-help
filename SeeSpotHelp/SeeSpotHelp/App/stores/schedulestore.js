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
		this.scheduleIdsForGroup = {};
		this.scheduleIdsForMember = {};
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
		console.log('ScheduleStore:emitChange');
		this.emit(CHANGE_EVENT);
	}

	getScheduleById(id) {
		if (this.schedule.hasOwnProperty(id)) {
			return this.schedule[id];
		} else {
			// TODO: download schedule.
			return null;
		}
	}

	getScheduleByMember(memberId) {
		var scheduleForMember = [];
		if (!this.scheduleIdsForMember.hasOwnProperty(memberId)) {
			this.downloadScheduleForMember(memberId);
			return null;
		}
		for (var i = 0; i < this.scheduleIdsForMember[memberId].length; i++) {
			scheduleForMember.push(
				this.schedule[this.scheduleIdsForMember[memberId][i]]);
		}
		return scheduleForMember;
	}

	getScheduleByGroup(groupId) {
		var scheduleForGroup = [];
		if (!this.scheduleIdsForGroup.hasOwnProperty(groupId)) {
			this.downloadScheduleForGroup(groupId);
			return null;
		}
		for (var i = 0; i < this.scheduleIdsForGroup[groupId].length; i++) {
			scheduleForGroup.push(
				this.schedule[this.scheduleIdsForGroup[groupId][i]]);
		}
		return scheduleForGroup;
	}

	getScheduleByAnimalId(animalId) {
		console.log('ScheduleStore:getScheduleByAnimalId');
		var scheduleForAnimal = [];
		if (!this.scheduleIdsForAnimal.hasOwnProperty(animalId)) {
			this.downloadScheduleForAnimal(animalId);
			return null;
		}
		for (var i = 0; i < this.scheduleIdsForAnimal[animalId].length; i++) {
			scheduleForAnimal.push(
				this.schedule[this.scheduleIdsForAnimal[animalId][i]]);
		}
		return scheduleForAnimal;
	}

	addScheduleIdToMapping(mapping, key, scheduleId) {
		if (!mapping[key]) {
			mapping[key] = [];
		}
		mapping[key].push(scheduleId);
	}

	scheduleAdded(snapshot) {
		console.log('ScheduleStore:scheduleAdded');
		if (snapshot.val()) {
			var schedule = Schedule.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!schedule.id) return;
			this.addScheduleIdToMapping(this.scheduleIdsForAnimal, schedule.animalId, schedule.id);
			this.addScheduleIdToMapping(this.scheduleIdsForGroup, schedule.groupId, schedule.id);
			this.addScheduleIdToMapping(this.scheduleIdsForMember, schedule.userId, schedule.id);
			this.schedule[schedule.id] = schedule;

			this.emitChange();
		}
	}

	deleteScheduleFromMapping(mapping, key, deletedScheduleId) {
		for (var i = 0; i < mapping[key].length; i++) {
			var scheduleId = mapping[key][i];
			if (scheduleId == deletedScheduleId) {
				mapping[key].splice(i, 1);
				return;
			}
		}
	}

	scheduleDeleted(snapshot) {
		var deletedSchedule = snapshot.val();
		delete this.schedule[deletedSchedule.id];
		this.deleteScheduleFromMapping(
			this.scheduleIdsForAnimal,
			deletedSchedule.animalId,
			deletedSchedule.id);
		this.deleteScheduleFromMapping(
			this.scheduleIdsForGroup,
			deletedSchedule.groupId,
			deletedSchedule.id);
		this.deleteScheduleFromMapping(
			this.scheduleIdsForMember,
			deletedSchedule.userId,
			deletedSchedule.id);
		this.emitChange();
	}

	scheduleChanged(snapshot) {
		var changedSchedule = Schedule.castObject(snapshot.val());
		if (this.schedule.hasOwnProperty(changedSchedule.id)) {
			this.schedule[changedSchedule.id] = changedSchedule;
		} else {
			// Must have been an update to a newly added animal id.
			this.scheduleAdded(snapshot);
		}
	}

	downloadScheduleMatchingProperty(property, value) {
		DataServices.OnMatchingChildAdded(
			"schedule",
			property,
			value,
			this.scheduleAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			"schedule",
			property,
			value,
			this.scheduleDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			"schedule",
			property,
			value,
			this.scheduleChanged.bind(this));
	}

	downloadScheduleForAnimal(animalId) {
		// So we don't try to download it again if there is no schedule (e.g. differentiate from
		// null).
		this.scheduleIdsForAnimal[animalId] = [];
		this.downloadScheduleMatchingProperty('animalId', animalId);
	}

	downloadScheduleForGroup(groupId) {
		// So we don't try to download it again if there is no schedule (e.g. differentiate from
		// null).
		this.scheduleIdsForGroup[groupId] = [];
		this.downloadScheduleMatchingProperty('groupId', groupId);
	}

	downloadScheduleForMember(memberId) {
		// So we don't try to download it again if there is no schedule (e.g. differentiate from
		// null).
		this.scheduleIdsForMember[memberId] = [];
		this.downloadScheduleMatchingProperty('userId', memberId);
	}

	handleAction(action) {
		switch (action.type) {
			default:
				break;
		}
	}
}

module.exports = new ScheduleStore();
