import DataServices = require('./dataservices');
import DatabaseObject = require('./databaseobject');

enum PermissionsEnum {
	MEMBER = 0,
	NONMEMBER = 1,
	ADMIN = 2,
	PENDINGMEMBERSHIP = 3,
	MEMBERSHIPDENIED = 4
}

class Permission extends DatabaseObject {
	public userId: string;
	public groupId: string;
	public permission: PermissionsEnum = PermissionsEnum.NONMEMBER;
	public firebasePath: string = 'permissions/';
	public classNameForSessionStorage: string = 'Permission';

	constructor(userId: string, groupId: string, permission: PermissionsEnum) {
		super();
		this.userId = userId;
		this.groupId = groupId;
		this.permission = permission;

		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
	}

	createInstance() { return new Permission('', '', PermissionsEnum.NONMEMBER); }

	public static CreateAdminPermission(userId, groupId) {
		return new Permission(userId, groupId, PermissionsEnum.ADMIN);
	}

	public static CreateMemberPermission(userId, groupId) {
		return new Permission(userId, groupId, PermissionsEnum.MEMBER);
	}

	public static CreatePendingPermission(userId, groupId) {
		return new Permission(userId, groupId, PermissionsEnum.PENDINGMEMBERSHIP);
	}

	public static CreateNonMemberPermission(userId, groupId) {
		return new Permission(userId, groupId, PermissionsEnum.NONMEMBER);
	}

	setDenied() {
		this.permission = PermissionsEnum.MEMBERSHIPDENIED;
	}

	setPending() {
		this.permission = PermissionsEnum.PENDINGMEMBERSHIP;
	}

	setMember() {
		this.permission = PermissionsEnum.MEMBER;
	}

	leave() {
		return this.permission == PermissionsEnum.NONMEMBER;
	}

	inGroup() {
		return this.permission == PermissionsEnum.MEMBER ||
			this.permission == PermissionsEnum.ADMIN;
	}

	notInGroup() {
		return this.permission == PermissionsEnum.MEMBERSHIPDENIED ||
			this.permission == PermissionsEnum.NONMEMBER;
	}

	pending() {
		return this.permission == PermissionsEnum.PENDINGMEMBERSHIP;
	}

	member() {
		return this.permission == PermissionsEnum.MEMBER;
	}

	denied() {
		return this.permission == PermissionsEnum.MEMBERSHIPDENIED;
	}

	admin () {
		return this.permission == PermissionsEnum.ADMIN;
	}

	public static castObject(obj) {
		var permission = new Permission('', '', PermissionsEnum.NONMEMBER);
		for (var prop in obj) permission[prop] = obj[prop];
		return permission;
	}

	update() {
		if (this.permission == PermissionsEnum.NONMEMBER) {
			this.delete();
		} else {
			super.update();
		}
	}
}

export = Permission;
