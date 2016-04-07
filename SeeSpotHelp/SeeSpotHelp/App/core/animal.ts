var DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');
var StringUtils = require('./stringutils');

// An animal that is currently being managed by a volunteer group.

class Animal {

	public name: string;
	public type: string;
	public breed: string;
	public age: number;
	public status: number = Animal.StatusEnum.ADOPTABLE;
	public id: string;
	public groupId: string;
	public classNameForSessionStorage: string = 'Animal';

	// Only used for searching:
	public zipCode: string;
	public shelter: string;
	public city: string;
	public state: string;
	public firebasePath: string = "animals/";

	public static StatusEnum = Object.freeze(
		{
			ADOPTABLE: 0,  // Animal is currently up for adoption.
			RESCUEONLY: 1,  // Animal can be adopted to rescue groups only.
			MEDICAL: 2,  // Animal is not up for adoption due to medical reasons.
			ADOPTED: 3,  // Animal has been adopted, YAY!
			PTS: 4,  // Animal has been put to sleep. :*(
			NLL: 5,  // Animal is No Longer Living due to other reasons.  Can be
			// used instead of PTS if people would prefer not to specify,
			// or if animal died of other causes.
			OTHER: 6 // In case I'm missing any other circumstances...
		}
	)

	constructor() { }

	public static GetTypeOptions() {
		return [
			"Dog", "Cat", "Other"
		];
	}

	CopyGroupFields(group) {
		// Add these fields for searching.
		this.zipCode = StringUtils.MakeSearchable(group.zipCode);
		this.shelter = StringUtils.MakeSearchable(group.shelter);
		this.city = StringUtils.MakeSearchable(group.city);
		this.state = StringUtils.MakeSearchable(group.state);
	}

	getDefaultPhoto() {
		if (this.type.toLowerCase() == 'cat') {
			return 'images/cat.png';
		} else if (this.type.toLowerCase() == 'dog') {
			return 'images/dog.png'
		} else {
			return 'images/other.jpg';
		}
	}

	public static castObject(obj) {
		var animal = new Animal();
		animal.copyFieldsFrom(obj);
		return animal;
	}

	copyFieldsFrom(other) {
		for (var prop in other) {
			this[prop] = other[prop];
		}
	}

	delete() {
		DataServices.RemoveFirebaseData(this.firebasePath + this.id);
	}

	// Attempts to insert the current instance into the database as
	// a animal
	insert(callback) {
		// Get rid of undefineds to make firebase happy.
		this.id = null;
		this.id = DataServices.PushFirebaseData(this.firebasePath, this).id;
		DataServices.UpdateFirebaseData(this.firebasePath + this.id, { id: this.id });
	}

	update() {
		DataServices.UpdateFirebaseData(this.firebasePath + this.id, this);
	}
}

export = Animal;
