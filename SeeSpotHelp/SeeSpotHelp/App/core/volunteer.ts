// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

import VolunteerGroup = require('./volunteergroup');
import DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');
var Firebase = require("firebase");
import DatabaseObject = require('./databaseobject');

class Volunteer extends DatabaseObject {
	public name: string;
	public displayName: string;
	public email: string;
	public inBeta: boolean; // TODO: Check for security issues with this.
	public groups: Array<VolunteerGroup>;
	public classNameForSessionStorage: string = 'Volunteer';
	public firebasePath: string = 'users';

	constructor(name, email, id) {
		super();
	};

	defaultGroupId() {
		for (var groupId in this.groups) {
			return groupId;
		}
		return null;
	}

	public createInstance() { return new Volunteer('', '', ''); };

	public static LoadVolunteer(id, name, email, callback) {

		var onSuccess = function (response) {
			var volunteer = null;
			if (response) {
				volunteer = this.castObject(response);
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
		dataServices.GetFirebaseData("users/" + id, false);
	}

	// Returns the default volunteer group this volunteer belongs to,
	// if any. If the volunteer does not exist yet in the server db, they
	// will be inserted. Returns null if user is not attached to any
	// groups.
	getDefaultVolunteerGroup() {
		// Note: If there is more than one group this user belongs to, should
		// we let them specify the "default" one?  Probably not a common
		// scenario to have more than one.
		return this.groups.length > 0 ? this.groups[0] : null;
	}
}

export = Volunteer;
