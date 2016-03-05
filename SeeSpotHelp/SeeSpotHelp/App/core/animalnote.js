
var AJAXServices = require('./AJAXServices');
var dateFormat = require('dateformat');

var AnimalNote = function(note, animalId, groupId, userId) {
    this.note = note;
    this.timestamp = Date.now();
    this.byUserId = userId;
    this.animalId = animalId;
    this.groupId = groupId;
    this.id = null;
}

AnimalNote.prototype.insert = function() {
    this.id = AJAXServices.PushFirebaseData("notes", this).id;
    AJAXServices.UpdateFirebaseData("notes/" + this.id, this);
}

AnimalNote.prototype.update = function() {
    AJAXServices.UpdateFirebaseData("notes/" + this.id, this);
}

AnimalNote.prototype.delete = function() {
    AJAXServices.RemoveFirebaseData("notes/" + this.id);
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
