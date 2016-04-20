// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

import VolunteerGroup from './volunteergroup';
import DataServices from '../dataservices';
import DatabaseObject from './databaseobject';
var ServerResponse = require('../serverresponse');

class Volunteer extends DatabaseObject {
	public name: string;
	public displayName: string;
	public email: string;
	public inBeta: boolean;
	public betaCode: string;
	public firebasePath: string = 'users';

	constructor(name, email) {
		super();
		this.name = name;
		this.email = email;
	};

	public createInstance() { return new Volunteer('', ''); };

	// We don't push data for inserts so override base implementation.
	insert() {
		DataServices.SetFirebaseData(this.firebasePath + '/' + this.id, this);
	}
}

export default Volunteer;
