
var AJAXServices = require('./AJAXServices');

var AnimalNote = function(note, animalId, userId) {
    this.note = note;
    this.byUserId = userId;
    this.animalId = animalId;
    this.id = null;
}

AnimalNote.prototype.insert = function() {
    this.id = AJAXServices.PushFirebaseData("notes", this).id;
    AJAXServices.UpdateFirebaseData("notes/" + this.id, this);
}

AnimalNote.prototype.toDisplayString = function(user) {
    return this.note + (user ? " - " + user.name : "");
}

AnimalNote.castObject = function(obj) {
    var group = new AnimalNote();
    group = Object.assign(group, obj);
    return group;
};

module.exports = AnimalNote;
