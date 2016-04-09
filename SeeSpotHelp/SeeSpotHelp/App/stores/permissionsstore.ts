'use strict';

var Permission = require('../core/permission');
import BaseStore = require('./basestore');
import { DatabaseObject } from '../core/databaseobject';

class PermissionsStore extends BaseStore {
	protected databaseObject: DatabaseObject = new Permission();

	constructor() {
		super();

		this.Init();
	}

	getPermissionsByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}

	getPermissionsByUserId(userId) {
		return this.getItemsByProperty('userId', userId);
	}

	getPermission(userId, groupId) {
		var permissions = this.getPermissionsByUserId(userId);
		if (!permissions) return Permission.CreateNonMemberPermission(userId, groupId);

		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i].groupId == groupId) {
				return permissions[i];
			}
		}

		console.log('WARN: Shouldn\'t get here');
		return Permission.CreateNonMemberPermission(userId, groupId);
	}

	downloadPermissionsByUserId(userId) {
		this.downloadFromMapping('userId', userId);
	}

	downloadPermissionsByGroupId(groupId) {
		this.downloadFromMapping('groupId', groupId);
	}
}

export = new PermissionsStore();
