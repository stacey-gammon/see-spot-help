var DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');
var StringUtils = require('./stringutils');

// An animal that is currently being managed by a volunteer group.

var Animal = function(name, type, breed, age, status, photo, id, groupId) {
	this.name = name;
	this.type = type;
	this.breed = breed;
	this.age = age;
	this.status = status ? status : Animal.StatusEnum.ADOPTABLE;
	this.photo = photo ? photo : null;
	this.id = id ? id : null;
	this.groupId = groupId;


	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'Animal';
};

Animal.GetTypeOptions = function () {
	return [
		"Dog", "Cat", "Other"
	];
};

Animal.prototype.CopyGroupFields = function (group) {
	// Add these fields for searching.
	this.zipCode = StringUtils.MakeSearchable(group.zipCode);
	this.shelter = StringUtils.MakeSearchable(group.shelter);
	this.city = StringUtils.MakeSearchable(group.city);
	this.state = StringUtils.MakeSearchable(group.state);
};

Animal.prototype.getPhoto = function() {
	if (this.photo) return this.photo;
	return this.type.toLowerCase() == "cat" ?
		"images/cat.png" :
		this.type.toLowerCase() == "dog" ?
		"images/dog.png" :
		"images/other.jpg";
};

Animal.StatusEnum = Object.freeze(
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
);

Animal.castObject = function (obj) {
	var animal = new Animal();
	animal.copyFieldsFrom(obj);
	return animal;
};

Animal.prototype.copyFieldsFrom = function (other) {
	for (var prop in other) {
		this[prop] = other[prop];
	}
};

Animal.prototype.delete = function() {
	var firebasePath = "animals";
	DataServices.RemoveFirebaseData(firebasePath + "/" + this.id);
};

// Attempts to insert the current instance into the database as
// a animal
Animal.prototype.insert = function (callback) {
	var firebasePath = "animals";

	// Get rid of undefineds to make firebase happy.
	this.id = null;
	if (!this.photo) this.photo = null;

	this.id = DataServices.PushFirebaseData(firebasePath, this).id;
	DataServices.UpdateFirebaseData(firebasePath + "/" + this.id, { id: this.id });
};

Animal.prototype.update = function () {
	DataServices.UpdateFirebaseData("animals/" + this.id, this);
};

module.exports = Animal;
