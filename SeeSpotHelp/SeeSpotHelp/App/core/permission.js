var DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');

var PermissionsEnum = Object.freeze(
	{
		MEMBER: 0,
		NONMEMBER: 1,
		ADMIN: 2,
		PENDINGMEMBERSHIP: 3,
		MEMBERSHIPDENIED: 4
	}
);

var Permission = function(userId, groupId, permission) {
	this.id = '';
	this.userId = userId;
	this.groupId = groupId;
	this.permission = permission;
	this.baseFirebasePath = 'permissions/';

	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'Permission';
};

Permission.CreateAdminPermission = function (userId, groupId) {
	return new Permission(userId, groupId, PermissionsEnum.ADMIN);
};

Permission.CreateMemberPermission = function (userId, groupId) {
	return new Permission(userId, groupId, PermissionsEnum.MEMBER);
};

Permission.CreatePendingPermission = function (userId, groupId) {
	return new Permission(userId, groupId, PermissionsEnum.PENDINGMEMBERSHIP);
};

Permission.CreateNonMemberPermission = function (userId, groupId) {
	return new Permission(userId, groupId, PermissionsEnum.NONMEMBER);
};

Permission.prototype.setDenied = function () {
	this.permission = PermissionsEnum.MEMBERSHIPDENIED;
};

Permission.prototype.setPending = function () {
	this.permission = PermissionsEnum.PENDINGMEMBERSHIP;
};

Permission.prototype.setMember = function () {
	this.permission = PermissionsEnum.MEMBER;
};

Permission.prototype.leave = function () {
	return this.permission == PermissionsEnum.NONMEMBER;
};

Permission.prototype.inGroup = function () {
	return this.permission == PermissionsEnum.MEMBER ||
		this.permission == PermissionsEnum.ADMIN;
};

Permission.prototype.notInGroup = function () {
	return this.permission == PermissionsEnum.MEMBERSHIPDENIED ||
		this.permission == PermissionsEnum.NONMEMBER;
};

Permission.prototype.pending = function () {
	return this.permission == PermissionsEnum.PENDINGMEMBERSHIP;
};

Permission.prototype.member = function () {
	return this.permission == PermissionsEnum.MEMBER;
};

Permission.prototype.denied = function () {
	return this.permission == PermissionsEnum.MEMBERSHIPDENIED;
};

Permission.prototype.admin = function () {
	return this.permission == PermissionsEnum.ADMIN;
};

Permission.castObject = function (obj) {
	var permission = new Permission();
	for (var prop in obj) permission[prop] = obj[prop];
	return permission;
};

Permission.prototype.delete = function() {
	DataServices.RemoveFirebaseData(this.baseFirebasePath + this.id);
};

Permission.prototype.insert = function () {
	this.id = DataServices.PushFirebaseData(this.baseFirebasePath, this).id;
};

Permission.prototype.update = function () {
	if (this.permission == PermissionsEnum.NONMEMBER) {
		this.delete();
	} else {
		DataServices.UpdateFirebaseData(this.baseFirebasePath + this.id, this);
	}
};

module.exports = Permission;
