
var DataServices = require('./dataservices');
var dateFormat = require('dateformat');

var AnimalNote = function(note, animalId, groupId, userId) {
	this.note = note;
	this.timestamp = Date.now();
	this.userId = userId;
	this.animalId = animalId;
	this.groupId = groupId;
	this.id = null;


	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'AnimalNote';
}

AnimalNote.prototype.insert = function() {
	this.id = DataServices.PushFirebaseData("notes", this).id;
	DataServices.UpdateFirebaseData("notes/" + this.id, this);
}

AnimalNote.prototype.update = function() {
	DataServices.UpdateFirebaseData("notes/" + this.id, this);
}

AnimalNote.prototype.delete = function() {
	DataServices.RemoveFirebaseData("notes/" + this.id);
}

AnimalNote.prototype.getDateForDisplay = function() {
	return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
}

AnimalNote.prototype.toDisplayString = function() {
	return this.note;
}

AnimalNote.castObject = function(obj) {
	var group = new AnimalNote();
	group = Object.assign(group, obj);
	return group;
};

module.exports = AnimalNote;
