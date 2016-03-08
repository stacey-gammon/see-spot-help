"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Volunteer = require('../core/volunteer');
var LoginActions = require("../actions/loginactions");
var DataServices = require("../core/dataservices");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class VolunteerStore extends EventEmitter {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			outer.handleAction(action);
		});
		this.volunteers = {};
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	// @param {function} callback
	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	getVolunteerById(userId) {
		if (this.volunteers.hasOwnProperty(userId)) {
			return this.volunteers[userId];
		} else {
			// Prevent multiple listeners being attached before the data is returned.
			this.volunteers[userId] = null;
			this.downloadVolunteer(userId);
			return null;
		}
	}

	volunteerDownloaded(volunteer) {
		this.volunteers[volunteer.id] = Volunteer.castObject(volunteer);
		this.emitChange();
	}

	downloadVolunteer(userId) {
		new DataServices(this.volunteerDownloaded.bind(this)).GetFirebaseData(
			"users/" + userId,
			true);
	}

	removeAllVolunteersFromGroup(group) {
		var outer = this;
		// Cache user in our store after downloading/
		var onSuccess = function (user) {
			var volunteer = Volunteer.castObject(user);
			delete volunteer.groups[group.id];
			DataServices.SetFirebaseData("users/" + user.id + "/groups/", volunteer.groups);
			outer.volunteers[user.id] = volunteer;
		}

		for (var userId in group.userPermissionsMap) {
			var volunteer = this.volunteers[userId];
			if (!volunteer) {
				Volunteer.LoadVolunteer(userId, "", "", onSuccess);
			} else {
				onSuccess(volunteer);
			}
		}
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	handleAction(action) {
		switch (action.type) {
			case ActionConstants.GROUP_DELETED:
				console.log("VolunteerStore:handleAction: Caught action GROUP_DELETED");
				// Need to drop all members out of the just deleted group.
				this.removeAllVolunteersFromGroup(action.group);
			default:
				break;
		};
	}
};

module.exports = new VolunteerStore();
