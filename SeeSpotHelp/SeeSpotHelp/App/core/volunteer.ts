// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

import VolunteerGroup from './volunteergroup';
import DataServices from './dataservices';
import DatabaseObject from './databaseobject';
var ServerResponse = require('./serverresponse');

class Volunteer extends DatabaseObject {
	public name: string;
	public displayName: string;
	public email: string;
	public inBeta: boolean; // TODO: Check for security issues with this.
	public groups: Array<VolunteerGroup>;
	public classNameForSessionStorage: string = 'Volunteer';
	public firebasePath: string = 'users';
	public betaCode: string;

	constructor(name, email) {
		super();
		this.name = name;
		this.email = email;
	};

	defaultGroupId() {
		for (var groupId in this.groups) {
			return groupId;
		}
		return null;
	}

	public createInstance() { return new Volunteer('', ''); };

	// We don't push data for inserts so override base implementation.
	insert() {
		DataServices.SetFirebaseData(this.firebasePath + '/' + this.id, this);
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

export default Volunteer;
