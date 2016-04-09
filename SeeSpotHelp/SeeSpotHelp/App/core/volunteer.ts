// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

var VolunteerGroup = require('./volunteergroup');
import DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');
var Firebase = require("firebase");

var Volunteer = function(name, email, id) {
	this.name = name;
	this.displayName = name;
	this.email = email;
	this.inBeta = false;

	// The id is the user id given by facebook.
	this.id = id;
	this.groups = {};

	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'Volunteer';
};

Volunteer.prototype.defaultGroupId = function () {
	for (var groupId in this.groups) {
		return groupId;
	}
	return null;
}

// Casts the given obj as a Volunteer.  Careful - obj must have
// originally been a type of Volunteer for this to work as expected.
// Helpful when passing around objects via React state and props.
// Can use this to restore the original class, complete with functions,
// from an object with only properties.
Volunteer.castObject = function (obj) {
	var volunteer = new Volunteer();
	for (var prop in obj) volunteer[prop] = obj[prop];
	return volunteer;
};

Volunteer.LoadVolunteer = function (id, name, email, callback) {
	console.log("Volunteer::LoadVolunteer");

	var onSuccess = function (response) {
		if (response) {
			volunteer = Volunteer.castObject(response);
		} else {
			volunteer = new Volunteer(name, email, id);
			DataServices.SetFirebaseData("users/" + id, volunteer);
		}
		callback(volunteer);
	};
	var onFailure = function (response) {
		console.log("failed");
		callback(null, new ServerResponse("err"));
	};

	var dataServices = new DataServices(onSuccess, onFailure);
	dataServices.GetFirebaseData("users/" + id);
}

// Returns the default volunteer group this volunteer belongs to,
// if any. If the volunteer does not exist yet in the server db, they
// will be inserted. Returns null if user is not attached to any
// groups.
Volunteer.prototype.getDefaultVolunteerGroup = function() {
	// Note: If there is more than one group this user belongs to, should
	// we let them specify the "default" one?  Probably not a common
	// scenario to have more than one.
	return this.groups.length > 0 ? this.groups[0] : null;
};

Volunteer.prototype.update = function() {
	DataServices.SetFirebaseData("users/" + this.id, this);
};

module.exports = Volunteer;
