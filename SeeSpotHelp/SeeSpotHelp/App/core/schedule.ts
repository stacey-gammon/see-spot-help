
import DataServices = require('./dataservices');

var Schedule = function() {
	this.start = '';
	this.end = '';
	this.title = '';
	this.allDay = true;
	this.userId = null;
	this.animalId = null;
	this.groupId = null;
	this.id = '';
	this.description = '';

	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'Schedule';
};

Schedule.castObject = function (obj) {
	var schedule = new Schedule();
	for (var prop in obj) schedule[prop] = obj[prop];
	return schedule;
};

Schedule.prototype.delete = function() {
	var firebasePath = "schedule/";
	DataServices.RemoveFirebaseData(firebasePath + "/" + this.id);
};

Schedule.prototype.insert = function () {
	var firebasePath = "schedule/";
	this.id = DataServices.PushFirebaseData(firebasePath, this).id;
	DataServices.UpdateFirebaseData(firebasePath + "/" + this.id, { id: this.id });
};

Schedule.prototype.update = function () {
	DataServices.UpdateFirebaseData("schedule/" + this.id, this);
};

module.exports = Schedule;
