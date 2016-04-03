var DataServices = require('./dataservices');
var ServerResponse = require('./serverresponse');
var StringUtils = require('./stringutils');

var Photo = function() {
	this.src = '';
	this.id = '';
	this.userId = '';
	this.groupId = '';
	this.userId = '';
	this.comment = '';

	// Unfortunately, I don't know anyway to generate this dynamically.
	this.classNameForSessionStorage = 'Photo';
};

Photo.castObject = function (obj) {
	var photo = new Photo();
	for (var prop in obj) photo[prop] = obj[prop];
	return photo;
};

Photo.prototype.delete = function() {
	var firebasePath = "photos/";
	DataServices.RemoveFirebaseData(firebasePath + "/" + this.id);
};

Photo.prototype.insert = function () {
	var firebasePath = "photos/";
	this.id = DataServices.PushFirebaseData(firebasePath, this).id;
	DataServices.UpdateFirebaseData(firebasePath + "/" + this.id, { id: this.id });
};

Photo.prototype.update = function () {
	DataServices.UpdateFirebaseData("photos/" + this.id, this);
};

module.exports = Photo;
