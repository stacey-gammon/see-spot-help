
var DataServices = require('./dataservices');


var AnimalActivity = function(animalNote, animalId, userId) {
	this.animalNote = animalNote;
	this.userId = userId;
	this.animalId = animalId;
	this.id = null;
}

module.exports = AnimalActivity;
