"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Animal = require('../core/animal');
var AJAXServices = require('../core/AJAXServices');
var AnimalStore = require("../stores/animalstore");

var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

class GroupStore extends EventEmitter {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			console.log("GroupStore:Dispatcher:register");
			outer.handleAction(action);
		});
		this.groups = {};
		this.loadedUserGroups = false;
	}

	loadedUserGroups() {
		return this.loadedUserGroups;
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	// @param {function} callback
	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	getPreviousGroup(groupId) {
		var previousGroup = null;
		for (var gId in this.groups) {
			if (gId == groupId) {
				return previousGroup;
			}
			previousGroup = this.groups[gId];
		}
		return null;
	}

	getNextGroup(groupId) {
		var groupFound = false;
		for (var gId in this.groups) {
			if (groupFound) {
				return this.groups[gId];
			}
			if (gId == groupId) {
				groupFound = true;
			}
		}
		return null;
	}

	getGroupById(groupId) {
		if (!this.groups.hasOwnProperty(groupId)) {
			console.log("group requested that hasn't been downloaded.  Downloading now...");
			this.downloadGroup(groupId);
		}
		return this.groups[groupId];
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	getUsersMemberGroups(user) {
		if (!user) return null;
		var usersGroups = [];
		for (var groupId in user.groups) {
			console.log("getUsersMemberGroups:GroupId:", groupId);
			if (!this.groups[groupId]) {
				this.downloadGroup(groupId);
				continue;
			}
			if (user.id in this.groups[groupId].userPermissionsMap &&
				this.groups[groupId].userPermissionsMap[user.id] !=
					VolunteerGroup.PermissionsEnum.NONMEMBER &&
				this.groups[groupId].userPermissionsMap[user.id] !=
					VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
				usersGroups.push(this.groups[groupId]);
			}
		}
		return usersGroups;
	}

	groupDownloaded(group) {
		if (!group) {
			console.log("WARN: group loaded data is null");
			return;
		}
		group = VolunteerGroup.castObject(group);
		for (var animal in group.animals) {
			group.animals[animal] = Animal.castObject(group.animals[animal]);
		}
		this.groups[group.id] = group;
		this.emitChange();
		this.loadedUserGroups = true;
	}

	downloadGroup(groupId) {
		// Already a download requested, skip.
		if (this.groups.hasOwnProperty(groupId)) {
			return;
		} else {
			this.groups[groupId] = null;
		}
		var dataServices = new AJAXServices(this.groupDownloaded.bind(this), null);
		dataServices.GetFirebaseData("groups/" + groupId, true);
		AnimalStore.downloadAnimals(groupId);
	}

	loadGroupsForUser(user) {
		var outer = this;
		var onSuccess = function (groups) {
			console.log("Loaded users groups: ");
			console.log(groups);

			var userInGroups = false;
			for (var groupId in groups) {
				outer.downloadGroup(groupId);
				userInGroups = false;
			}

			if (!userInGroups) {
				outer.loadedUserGroups = true;
				outer.emitChange();
			}
		};

		var dataServices = new AJAXServices(onSuccess, null);
		dataServices.GetFirebaseData("users/" + user.id + "/groups");
	}

	handleAction(action) {
		console.log("GroupStore:handleAction: " + action.type);
		switch (action.type) {
			case ActionConstants.GROUP_UPDATED:
			case ActionConstants.NEW_GROUP_ADDED:
				this.groups[action.group.id] = action.group;
				this.emitChange();
				break;
			case ActionConstants.ANIMAL_ADDED:
			case ActionConstants.ANIMAL_CHANGED:
				var animal = action.animal;
				var group = this.groups[animal.groupId];
				if (group) {
					group.animals[animal.id] = animal;
					this.emitChange();
				}
				break;
			case ActionConstants.ANIMAL_DELETED:
				var deletedAnimal = action.animal;
				delete this.groups[deletedAnimal.groupId].animals[deletedAnimal.id];
				this.emitChange();
				break;
			case ActionConstants.LOGIN_USER_SUCCESS:
				this.loadGroupsForUser(action.user);
				break;
			case ActionConstants.GROUP_DELETED:
				console.log("GroupStore:handleaction: caught GROUP_DELETED");
				AJAXServices.DetachListener(
					"groups/" + action.group.id,
					this.groupDownloaded.bind(this));
				delete this.groups[action.group.id];
				this.emitChange();
				break;
			default:
				break;
		}
	}
}

module.exports = new GroupStore();
