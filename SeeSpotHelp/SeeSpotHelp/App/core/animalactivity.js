
var AJAXServices = require('./AJAXServices');


var AnimalActivity = function(animalNote, animalId, userId) {
	this.animalNote = animalNote;
	this.userId = userId;
	this.animalId = animalId;
	this.id = null;
}

module.exports = AnimalActivity;
