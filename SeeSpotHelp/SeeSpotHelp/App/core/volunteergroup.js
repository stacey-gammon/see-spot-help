"use strict"

var ServerResponse = require("./serverresponse");
var DataServices = require('./dataservices');
var EventColors = require('./colors');
var Animal = require('./animal');

// A volunteer group represents a group of volunteers at a given
// shelter.  The most common scenario will be a one to mapping of
// shelter to volunteer group, though it is possible for there to
// be multiple groups linked to a single shelter. An example of this
// is if there are two separate volunteer groups for each animal
// type - i.e. cat volunteers and dog volunteers. Another scenario
// is if a random person creates a volunteer group for a shelter, then
// stops using the app.  It will just sit there unused and the real
// volunteers will have to create a separate group.

// Creates a new volunteer group with the given fields.
// @param name {string} The group name.
// @param shelter {string} The shelter name.
// @param address {string} The street address of the shelter.
// @param city {string} The city of the sheleter.
// @param state {string} The state the shelter belongs in.
// @param zipCode {string} The zip code the shelter resides in.
// @param id {string} the id of the group.
var VolunteerGroup = function(name, shelter, address, city, state, zipCode, id) {
	// This is only used when loading state from session storage, to know how to cast the object
	this.isAGroup = true;
	this.name = name;
	this.shelter = shelter;
	this.address = address;
	this.city = city;
	this.state = state;
	this.zipCode = zipCode;
	this.id = id ? id : null;

	// Mapping of user id to permission enum, one entry per
	// member in the volunteer group.
	this.userPermissionsMap = {};
	this.animals = {};

	this.availableMemberColors = new EventColors();
	this.availableAnimalColors = new EventColors();

	for (var prop in VolunteerGroup.CalendarColorsEnum) {
		this.availableColors.push(VolunteerGroup.CalendarColorsEnum[prop]);
	}

	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'VolunteerGroup';
};

VolunteerGroup.FromJSON = function (json) {
	var group = VolunteerGroup.castObject(json);
	group.availableMemberColors = Object.assign(new EventColors(), group.availableMemberColors);
	group.availableAnimalColors = Object.assign(new EventColors(), group.availableAnimalColors);
	return group;
};

VolunteerGroup.prototype.RemoveAnimalColor = function(color) {
	this.availableAnimalColors.RemoveColor(color);
}

VolunteerGroup.prototype.RemoveVolunteerColor = function(color) {
	this.availableMemberColors.RemoveColor(color);
}

VolunteerGroup.prototype.GetColorForVolunteer = function () {
	return this.availableMemberColors.GetAvailableColor();
};

VolunteerGroup.prototype.GetColorForAnimal = function () {
	return this.availableAnimalColors.GetAvailableColor();
};

// Casts the given obj as a volunteer group.  Careful -
// obj must have originally been a type of VolunteerGroup
// for this to work as expected.  Helpful when passing around
// objects via React state and props.  Can use this to restore the
// original class, complete with functions, from an object with only
// properties.
VolunteerGroup.castObject = function(obj) {
	var group = new VolunteerGroup();
	group = Object.assign(group, obj);
	return group;
};

VolunteerGroup.prototype.copyFieldsFrom = function (other) {
	for (var prop in other) {
		this[prop] = other[prop];
	}
}

VolunteerGroup.prototype.memberCount = function () {
	var count = 0;
	for (var memberId in this.userPermissionsMap) {
		if (this.userPermissionsMap[memberId] == VolunteerGroup.PermissionsEnum.ADMIN ||
			this.userPermissionsMap[memberId] == VolunteerGroup.PermissionsEnum.MEMBER) {
			count++;
		}
	}
	return count;
}

VolunteerGroup.PermissionsEnum = Object.freeze(
	{
		MEMBER: 0,
		NONMEMBER: 1,
		ADMIN: 2,
		PENDINGMEMBERSHIP: 3,
		MEMBERSHIPDENIED: 4
	}
);

// Creates and returns a new volunteer group based on the fields supplied
// by the user during an input form.
// @param inputFields { { fieldName : InputField} } - A object where the keys
// are the field name (e.g. "groupName", "shelterName") and the values are
// InputFields which hold the values given by the user.
VolunteerGroup.createFromInputFields = function(inputFields, adminId) {
	var group = new VolunteerGroup();
	group.updateFromInputFields(inputFields);
	group.userPermissionsMap[adminId] = VolunteerGroup.PermissionsEnum.ADMIN;
	return group;
};

// Creates and returns a new volunteer group based on the fields supplied
// by the user during an input form.
// @param inputFields { { fieldName : InputField} } - A object where the keys
// are the field name (e.g. "groupName", "shelterName") and the values are
// InputFields which hold the values given by the user.
VolunteerGroup.prototype.updateFromInputFields = function (inputFields) {
	this.name = inputFields["name"].value;
	this.shelter = inputFields["shelter"].value;
	this.address = inputFields["address"].value;
	this.city = inputFields["city"].value;
	this.state = inputFields["state"].value;
	this.zipCode = inputFields["zipCode"].value;
};

VolunteerGroup.search = function (searchText) {
	var results = [];
	var fakeGroups = VolunteerGroup.getFakeGroups();
	for (var key in fakeGroups) {
		if (!fakeGroups.hasOwnProperty(key)) {
			continue;
		}
		var fakeGroup = fakeGroups[key];
		if (fakeGroup.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
			results.push(fakeGroup);
		}
	}
	return results;
};

VolunteerGroup.prototype.shouldAllowUserToEdit = function (userId) {
	var userPermissions = this.getUserPermissions(userId);
	return userPermissions == VolunteerGroup.PermissionsEnum.MEMBER ||
		   userPermissions == VolunteerGroup.PermissionsEnum.ADMIN;
};

VolunteerGroup.prototype.getUserPermissions = function (userId) {
	if (this.userPermissionsMap.hasOwnProperty(userId)) {
		return this.userPermissionsMap[userId];
	} else {
		return VolunteerGroup.PermissionsEnum.NONMEMBER;
	}
};

VolunteerGroup.prototype.requestToJoin = function (user) {
	this.updateMembership(user, VolunteerGroup.PermissionsEnum.PENDINGMEMBERSHIP);

	var adminIds = [];
	for (var userId in this.userPermissionsMap) {
		if (this.userPermissionsMap[userId] == VolunteerGroup.PermissionsEnum.ADMIN) {
			DataServices.PushFirebaseData('emails/tasks',
				{
					eventType: 'NEW_REQUEST_PENDING',
					memberName: user.name,
					groupId: this.id,
					adminId: userId
				 });
		}
	}
}

VolunteerGroup.prototype.approveMembership = function(user) {
	this.updateMembership(user, VolunteerGroup.PermissionsEnum.MEMBER);
	DataServices.PushFirebaseData('emails/tasks',
		{
			eventType: 'REQUEST_APPROVED',
			userEmail: user.email,
			groupName: this.name
		 });
}

VolunteerGroup.prototype.updateMembership = function (user, membershipType) {
	this.userPermissionsMap[user.id] = membershipType;
	DataServices.SetFirebaseData("groups/" + this.id + "/userPermissionsMap/" + user.id,
								 membershipType);

	if (membershipType == VolunteerGroup.PermissionsEnum.NONMEMBER) {
		delete user.groups[this.id];
	} else {
		user.groups[this.id] = membershipType;
	}
	DataServices.SetFirebaseData("users/" + user.id + "/groups", user.groups);
}

VolunteerGroup.prototype.delete = function () {
	console.log("VolunteerGroup.delete");
	var outer = this;
	var onComplete = function (error) {
		if (!error) {
			console.log("VolunteerGroup.delete: Group deleted successfully!");
		} else {
			console.log("WARN: delete group failed with error " + error);
		}
	}

	DataServices.SetFirebaseData("deletedGroups/" + this.id, this);
	DataServices.RemoveFirebaseData("groups/" + this.id, onComplete);
}

// Attempts to insert the current instance into the database as
// a new volunteer group.
// @param callback {Function(VolunteerGroup, ServerResponse) }
//	 callback is expected to take as a first argument the potentially
//	 inserted volunteer group (null on failure) and a server
//	 response to hold error and success information.
VolunteerGroup.prototype.insert = function (user, callback) {
	console.log("VolunteerGroup.insertWithFirebase");

	this.id = null;
	this.id = DataServices.PushFirebaseData("groups", this).id;
	//DataServices.UpdateFirebaseData("groups/" + this.id, { id: this.id });

	user.groups[this.id] = VolunteerGroup.PermissionsEnum.ADMIN;
	DataServices.UpdateFirebaseData("users/" + user.id + "/groups", user.groups);
	callback(this, new ServerResponse());
};

// Attempts to update the current volunteer group into the database.
// @param callback {Function(VolunteerGroup, ServerResponse) }
//	 callback is expected to take as a first argument the potentially
//	 updated volunteer group (null on failure) and a server
//	 response to hold error and success information.
VolunteerGroup.prototype.update = function (callback) {
	DataServices.UpdateFirebaseData("groups/" + this.id, this);
	callback(this, new ServerResponse());
};

module.exports = VolunteerGroup;
