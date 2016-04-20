"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');

import VolunteerGroup from '../core/databaseobjects/volunteergroup';
import Animal from '../core/databaseobjects/animal';
import DatabaseObject from '../core/databaseobjects/databaseobject';

import DataServices from '../core/dataservices';
import VolunteerStore from "../stores/volunteerstore";
import PermissionsStore from "../stores/permissionsstore";

import BaseStore from './basestore';

class GroupStore extends BaseStore {
	protected databaseObject: DatabaseObject = new VolunteerGroup();

	constructor() {
		super();

		this.Init();
		// var outer = this;
		// this.dispatchToken = Dispatcher.register(function (action) {
		// 	outer.handleAction(action);
		// });
	}

	getGroupById(groupId) {
		return this.getItemById(groupId);
	}

	getGroupsByUser(user) {
		if (!user) return null;
		var groupsForUser = [];
		var permissions = PermissionsStore.getPermissionsByUserId(user.id);
		if (!permissions) return null;

		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i].inGroup() || permissions[i].pending()) {
				var group = this.storage[permissions[i].groupId];
				if (!group) {
					this.downloadItem(permissions[i].groupId);
				} else {
					groupsForUser.push(this.storage[permissions[i].groupId]);
				}
			}
		}
		return groupsForUser;
	}

	groupAdded(snapshot) {
		if (snapshot.val()) {
			var group = VolunteerGroup.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!group.id) return;
			this.storage[group.id] = group;
			this.emitChange();
		}
	}

	handleAction(action) {
	// 	console.log("GroupStore:handleAction: " + action.type);
	// 	switch (action.type) {
	// 		case ActionConstants.GROUP_UPDATED:
	// 		case ActionConstants.NEW_GROUP_ADDED:
	// 			this.groups[action.group.id] = action.group;
	// 			this.emitChange();
	// 			break;
	// 		case ActionConstants.ANIMAL_ADDED:
	// 		case ActionConstants.ANIMAL_CHANGED:
	// 			var animal = action.animal;
	// 			var group = this.groups[animal.groupId];
	// 			if (group) {
	// 				if (animal.color) {
	// 					group.RemoveAnimalColor(animal.color);
	// 				}
	// 				this.emitChange();
	// 			}
	// 			break;
	// 		case ActionConstants.ANIMAL_DELETED:
	// 			var deletedAnimal = action.animal;
	// 			this.emitChange();
	// 			break;
	// 		case ActionConstants.LOGIN_USER_SUCCESS:
	// 			break;
	// 		case ActionConstants.GROUP_DELETED:
	// 			console.log("GroupStore:handleaction: caught GROUP_DELETED");
	// 			DataServices.DetachListener(
	// 				"groups/" + action.group.id,
	// 				this.groupDownloaded.bind(this));
	// 			delete this.storage[action.group.id];
	// 			this.emitChange();
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
	}
}

export default new GroupStore();
