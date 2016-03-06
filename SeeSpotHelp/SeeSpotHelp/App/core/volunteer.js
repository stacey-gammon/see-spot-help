// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

var VolunteerGroup = require('./volunteergroup');
var AJAXServices = require('./AJAXServices');
var Firebase = require("firebase");

var Volunteer = function(name, email, id) {
	this.name = name;
	this.displayName = name;
	this.email = email;
	this.inBeta = false;

	// The id is the user id given by facebook.
	this.id = id;
	this.groups = {};
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

Volunteer.LoadVolunteerWithFirebase = function (id, name, email, callback) {
	console.log("Volunteer::LoadVolunteerWithFirebase");

	var onSuccess = function (response) {
		console.log("Loaded from Firebase successfully with response ");
		console.log(response);
		if (response) {
			volunteer = Volunteer.castObject(response);
		} else {
			volunteer = new Volunteer(name, email, id);
			AJAXServices.SetFirebaseData("users/" + id, volunteer);
		}
		callback(volunteer);
	};
	var onFailure = function (response) {
		console.log("failed");
		callback(null, new ServerResponse("err"));
	};

	var dataServices = new AJAXServices(onSuccess, onFailure);
	dataServices.GetFirebaseData("users/" + id);
}

// Using this.id, attempt to load the volunteer from the
// database.  If no such volunteer exists, AddNewVolunteer
// will be called with some basic defaults supplied by
// facebook.
Volunteer.LoadVolunteer = function (id, name, email, callback) {
	if (AJAXServices.useFirebase) {
		Volunteer.LoadVolunteerWithFirebase(id, name, email, callback);
		return;
	}

	console.log("Volunteer::LoadVolunteer");
	if (jQuery.isEmptyObject(name)) { name = ""; }
	if (jQuery.isEmptyObject(email)) { email = ""; }

	var LoadedVolunteerWithData = function (response) {
		console.log("Volunteer::LoadVolunteerWithData");
		if (response.d.result) {
			var loadedVolunteer = Volunteer.castObject(response.d.volunteerData);
			console.log("Volunteer data:");
			console.log(response.d.volunteerData);
			console.log("Calling callback function now:");
			callback(loadedVolunteer);
			// TODO: Change so all callbacks look something like this:
			// callback(loadedVolunteer, new ServerResponse(Success));
		} else {
			console.log("Volunteer::LoadVolunteerWithData: Error occurred");
			ShowErrorMessage(response.d);
		}
	};

	//Invoked when the server has an error (just an example)
	var FailedCallback = function (error) {
		console.log("Volunteer::FailedCallback");
		var errorString = '';
		errorString += 'Message:==>' + error.responseText + '\n\n';

		// TODO: Change so callbacks look something like this:
		// outer.callback(null, new ServerResponse(Failed));
		alert(errorString);
	};

	var ajax = new AJAXServices(LoadedVolunteerWithData,
								FailedCallback);
	ajax.CallJSONService(
		"../../WebServices/volunteerServices.asmx",
		"getVolunteer",
		{ anID: id, name: name, email: email });
};

function ShowErrorMessage(serverResponse) {

	var msg = '';

	for (i = 0; i < serverResponse.messages.length; i++) {
		if (serverResponse.messages[i] != null) {
			msg += serverResponse.messages[i] + '\n\r';
		}
	}

	alert(msg);
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
	AJAXServices.SetFirebaseData("users/" + this.id, this);
};

module.exports = Volunteer;
