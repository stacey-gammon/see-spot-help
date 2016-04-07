'use strict';

var DataServices = require('../core/dataservices');
var Permission = require('../core/permission');
var BaseStore = require('./basestore');

class PermissionsStore extends BaseStore {
	constructor() {
		super();

		this.permissionsByUserId = [];
		this.permissionsByGroupId = [];
		this.permissions = {};

		this.firebasePath = 'permissions';
	}

	getPreviousGroupId(userId, groupId) {
		if (!this.groupPermissionsByUserId.hasOwnProperty(userId)) {
			this.groupPermissionsByUserId[userId] = [];
			return null;
		}

		var previousGroupId = null;
		for (var permissionId in this.groupPermissionsByUserId[userId]) {
			var gId = this.permissions[permissionId].groupId;
			if (gId == groupId) {
				return previousGroupId;
			}
			previousGroupId = gId;
		}
		return previousGroupId;
	}

	getNextGroupId(userId, groupId) {
		if (!this.groupPermissionsByUserId.hasOwnProperty(userId)) {
			this.groupPermissionsByUserId[userId] = [];
			return null;
		}

		var groupFound = false;
		for (var permissionId in this.groupPermissionsByUserId[userId]) {
			var gId = this.permissions[permissionId].groupId;
			if (groupFound) {
				return gId;
			}
			if (gId == groupId) {
				groupFound = true;
			}
		}
		return null;
	}

	getPermissionsByGroupId(groupId) {
		if (!this.permissionsByGroupId.hasOwnProperty(groupId)) {
			this.permissionsByGroupId[groupId] = [];
			this.downloadPermissionsByGroupId(groupId);
		}

		var groupPermissions = [];
		for (var i = 0; i < this.permissionsByGroupId[groupId].length; i++) {
			groupPermissions.push(this.permissions[this.permissionsByGroupId[groupId][i]]);
		}

		return groupPermissions;
	}

	getPermissionsByUserId(userId) {
		if (!this.permissionsByUserId.hasOwnProperty(userId)) {
			this.permissionsByUserId[userId] = [];
			this.downloadPermissionsByUserId(userId);
		}

		var userPermissions = [];
		for (var i = 0; i < this.permissionsByUserId[userId].length; i++) {
			userPermissions.push(this.permissions[this.permissionsByUserId[userId][i]]);
		}

		return userPermissions;
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
		this.downloadItemsWithMatchingProperty(
			this.firebasePath,
			'userId',
			userId,
			this.permissionAdded,
			this.permissionDeleted,
			this.permissionChanged);
	}

	downloadPermissionsByGroupId(groupId) {
		this.downloadItemsWithMatchingProperty(
			this.firebasePath,
			'groupId',
			groupId,
			this.permissionAdded,
			this.permissionDeleted,
			this.permissionChanged);
	}

	permissionAdded(snapshot) {
		if (snapshot.val()) {
			var permission = Permission.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!permission.id) return;
			this.addIdToMapping(this.permissionsByUserId, permission.userId, permission.id);
			this.addIdToMapping(this.permissionsByGroupId, permission.groupId, permission.id);
			this.permissions[permission.id] = permission;

			this.emitChange();
		}
	}

	permissionDeleted(snapshot) {
		var deletedPermission = snapshot.val();
		delete this.permissions[deletedPermission.id];
		this.deleteFromMapping(
			this.permissionsByUserId,
			deletedPermission.userId,
			deletedPermission.id);
		this.deleteFromMapping(
			this.permissionsByGroupId,
			deletedPermission.groupId,
			deletedPermission.id);
	}

	permissionChanged(snapshot) {
		var changedPermission = Permission.castObject(snapshot.val());
		if (this.permissions.hasOwnProperty(changedPermission.id)) {
			this.permissions[changedPermission.id] = changedPermission;
			this.emitChange();
		} else {
			this.permissionAdded(snapshot);
		}
	}

	downloadPermissionsForUser(userId) {
		DataServices.OnMatchingChildAdded(
			'permissions',
			'userId',
			userId,
			this.permissionAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			'permissions',
			'userId',
			userId,
			this.permissionDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			'permissions',
			'userId',
			userId,
			this.permissionChanged.bind(this));
	}
}

module.exports = new PermissionsStore();
