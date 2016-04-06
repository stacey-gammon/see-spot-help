"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Animal = require('../core/animal');
var DataServices = require('../core/dataservices');
var VolunteerStore = require("../stores/volunteerstore");
var PermissionsStore = require("../stores/permissionsstore");

var BaseStore = require('./basestore');

class GroupStore extends BaseStore {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			outer.handleAction(action);
		});
		this.groups = {};
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
			this.groups[groupId] = null;
			console.log("group requested that hasn't been downloaded.  Downloading now...");
			this.downloadGroup(groupId);
		}
		return this.groups[groupId];
	}

	getGroupsByUser(user) {
		if (!user) return null;
		var groupsForUser = [];
		var permissions = PermissionsStore.getPermissionsByUserId(user.id);
		if (!permissions) return null;

		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i].inGroup() || permissions[i].pending()) {
				var group = this.groups[permissions[i].groupId];
				if (!group) {
					this.downloadGroup(permissions[i].groupId);
				} else {
					groupsForUser.push(this.groups[permissions[i].groupId]);
				}
			}
		}
		return groupsForUser;
	}

	groupDownloaded(snapshot) {
		if (!snapshot.val()) {
			console.log("WARN: group loaded data is null");
			return;
		}
		var group = VolunteerGroup.FromJSON(snapshot.val());
		this.groups[group.id] = group;
		this.emitChange();
	}

	groupAdded(snapshot) {
		if (snapshot.val()) {
			var group = VolunteerGroup.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!group.id) return;
			if (!this.groupsByUserId[group.userId]) {
				this.groupsByUserId[group.userId] = [];
			}
			this.groupsByUserId[group.userId].push(group.id);
			this.groups[group.id] = group;

			this.emitChange();
		}
	}

	groupDeleted(snapshot) {
		var deletedGroup = snapshot.val();
		delete this.groups[deletedGroup.id];
		var userId = deletedGroup.userId;
		for (var i = 0; i < this.groupsByUserId[userId].length; i++) {
			var groupId = this.groupsByUserId[userId][i];
			if (groupId == deletedGroup.id) {
				this.groupsByUserId[userId].splice(i, 1);

				this.emitChange();
				return;
			}
		}
	}

	groupChanged(snapshot) {
		var changedGroup = Group.castObject(snapshot.val());
		if (this.groups.hasOwnProperty(changedGroup.id)) {
			this.groups[changedGroup.id] = changedGroup;
			this.emitChange();
		} else {
			// Must have been an update to a newly added animal id.
			this.groupAdded(snapshot);
		}
	}

	downloadGroupsForUser(userId) {
		DataServices.OnMatchingChildAdded(
			'groups',
			'userId',
			userId,
			this.groupAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			'groups',
			'userId',
			userId,
			this.groupDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			'groups',
			'userId',
			userId,
			this.groupChanged.bind(this));
	}

	downloadGroup(groupId) {
		DataServices.DownloadData('groups/' + groupId, this.groupDownloaded.bind(this));
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
					if (animal.color) {
						group.RemoveAnimalColor(animal.color);
					}
					this.emitChange();
				}
				break;
			case ActionConstants.ANIMAL_DELETED:
				var deletedAnimal = action.animal;
				this.emitChange();
				break;
			case ActionConstants.LOGIN_USER_SUCCESS:
				break;
			case ActionConstants.GROUP_DELETED:
				console.log("GroupStore:handleaction: caught GROUP_DELETED");
				DataServices.DetachListener(
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
