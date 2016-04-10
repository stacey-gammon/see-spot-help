'use strict';

import Permission = require('../core/permission');
import BaseStore = require('./basestore');

class PermissionsStore extends BaseStore {
	protected databaseObject: Permission = new Permission('', '');

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
