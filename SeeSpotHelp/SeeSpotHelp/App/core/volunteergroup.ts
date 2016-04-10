"use strict"

var ServerResponse = require("./serverresponse");
import DataServices = require('./dataservices');
import Color = require('./colors');
import Animal = require('./animal');
import Permission = require('./permission');
import DatabaseObject = require('./databaseobject');

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
class VolunteerGroup extends DatabaseObject {
	public name: string;
	public shelter: string;
	public address: string;
	public city: string;
	public state: string;
	public zipCode: string;
	// Unfortunately, I don't know anyway to generate this dynamically.
	public classNameForSessionStorage = 'VolunteerGroup';
	public firebasePath = 'groups';

	constructor() {
		super();

		// for (var prop in VolunteerGroup.CalendarColorsEnum) {
		// 	this.availableMemberColors.push(VolunteerGroup.CalendarColorsEnum[prop]);
		// }
	}

	createInstance() { return new VolunteerGroup(); }

	public static FromJSON(json) {
		var group = VolunteerGroup.castObject(json);
		return group;
	}

	RemoveAnimalColor(color) {
		//this.availableAnimalColors.RemoveColor(color);
	}

	RemoveVolunteerColor(color) {
		//this.availableMemberColors.RemoveColor(color);
	}

	GetColorForVolunteer() {
		return Color.GetAvailableColor();
		//return this.availableMemberColors.GetAvailableColor();
	}

	GetColorForAnimal() {
		return Color.GetAvailableColor();
		//return this.availableAnimalColors.GetAvailableColor();
	}

	// Casts the given obj as a volunteer group.  Careful -
	// obj must have originally been a type of VolunteerGroup
	// for this to work as expected.  Helpful when passing around
	// objects via React state and props.  Can use this to restore the
	// original class, complete with functions, from an object with only
	// properties.
	public static castObject(obj) {
		var group = new VolunteerGroup();
		group = Object.assign(group, obj);
		return group;
	}

	copyFieldsFrom(other) {
		for (var prop in other) {
			this[prop] = other[prop];
		}
	}

	memberCount() {
		return 'fixme';
	}

	public static PermissionsEnum = Object.freeze(
		{
			MEMBER: 0,
			NONMEMBER: 1,
			ADMIN: 2,
			PENDINGMEMBERSHIP: 3,
			MEMBERSHIPDENIED: 4
		}
	)

	// Creates and returns a new volunteer group based on the fields supplied
	// by the user during an input form.
	// @param inputFields { { fieldName : InputField} } - A object where the keys
	// are the field name (e.g. "groupName", "shelterName") and the values are
	// InputFields which hold the values given by the user.
	public static createFromInputFields(inputFields, adminId) {
		var group = new VolunteerGroup();
		group.updateFromInputFields(inputFields);
		return group;
	}

	// Creates and returns a new volunteer group based on the fields supplied
	// by the user during an input form.
	// @param inputFields { { fieldName : InputField} } - A object where the keys
	// are the field name (e.g. "groupName", "shelterName") and the values are
	// InputFields which hold the values given by the user.
	updateFromInputFields(inputFields) {
		this.name = inputFields["name"].value;
		this.shelter = inputFields["shelter"].value;
		this.address = inputFields["address"].value;
		this.city = inputFields["city"].value;
		this.state = inputFields["state"].value;
		this.zipCode = inputFields["zipCode"].value;
	}

	delete() {
		DataServices.SetFirebaseData("deletedGroups/" + this.id, this);
		super.delete();
	}

	// Attempts to insert the current instance into the database as
	// a new volunteer group.
	// @param callback {Function(VolunteerGroup, ServerResponse) }
	//	 callback is expected to take as a first argument the potentially
	//	 inserted volunteer group (null on failure) and a server
	//	 response to hold error and success information.
	insert(user?) {
		var inserts = this.getInserts();
		var permission = Permission.CreateAdminPermission(user.id, this.id);
		Object.assign(inserts, permission.getInserts());

		DataServices.UpdateMultiple(inserts);
	}
}

export = VolunteerGroup;
