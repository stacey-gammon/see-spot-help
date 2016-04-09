"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Photo = require("../core/photo");
import DataServices = require('../core/dataservices');
var AnimalActions = require('../actions/animalactions');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class PhotoStore extends EventEmitter {
	constructor() {
		super();
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			console.log("PhotoStore:Dispatcher:register");
			outer.handleAction(action);
		});

		this.photoIdsByGroupId = {};
		this.photoIdsByAnimalId = {};
		this.photoIdsByMemberId = {};
		this.photos = {};
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	// @param {function} callback
	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	getPhotosByAnimalId(animalId) {
		if (!this.photoIdsByAnimalId.hasOwnProperty(animalId)) {
			// Prevent downloading twice.
			this.photoIdsByAnimalId[animalId] = [];
			this.downloadPhotosForAnimal(animalId);
			return null;
		} else {
			var photos = [];
			for (var i = 0; i < this.photoIdsByAnimalId[animalId].length; i++) {
				photos.push(
					this.photos[this.photoIdsByAnimalId[animalId][i]]);
			}
			return photos;
		}
	}

	// Note this will only return the main photo for each animal in the group, used for the
	// animal list view.
	getPhotosByGroupId(groupId) {
		if (!this.photoIdsByGroupId.hasOwnProperty(groupId)) {
			// Prevent downloading twice.
			this.photoIdsByGroupId[groupId] = [];
			this.downloadAnimals(groupId);
			return null;
		}
		return this.animals[groupId];
	}

	addPhotoIdToMapping(mapping, key, photoId) {
		if (!mapping[key]) {
			mapping[key] = [];
		}
		mapping[key].push(photoId);
	}

	photoAdded(snapshot) {
		console.log('PhotoStore:photoAdded');
		if (snapshot.val()) {
			var photo = Photo.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!photo.id) return;
			this.addPhotoIdToMapping(this.photoIdsByAnimalId, photo.animalId, photo.id);
			this.addPhotoIdToMapping(this.photoIdsByGroupId, photo.groupId, photo.id);
			this.addPhotoIdToMapping(this.photoIdsByMemberId, photo.memberId, photo.id);
			this.photos[photo.id] = photo;

			this.emitChange();
		}
	}

	deletePhotoFromMapping(mapping, key, deletedPhotoId) {
		for (var i = 0; i < mapping[key].length; i++) {
			var photoId = mapping[key][i];
			if (photoId == deletedPhotoId) {
				mapping[key].splice(i, 1);
				return;
			}
		}
	}

	photoDeleted(snapshot) {
		var deletedPhoto = snapshot.val();
		delete this.photos[deletedPhoto.id];
		this.deletePhotoFromMapping(
			this.photoIdsByAnimalId,
			deletedPhoto.animalId,
			deletedPhoto.id);
		this.deletePhotoFromMapping(
			this.photoIdsByGroupId,
			deletedPhoto.groupId,
			deletedPhoto.id);
		this.deletePhotoFromMapping(
			this.photoIdsByMemberId,
			deletedPhoto.userId,
			deletedPhoto.id);
		this.emitChange();
	}

	photoChanged(snapshot) {
		var changedPhoto = Photo.castObject(snapshot.val());
		if (this.photos.hasOwnProperty(changedPhoto.id)) {
			this.photos[changedPhoto.id] = changedPhoto;
		} else {
			// Must have been an update to a newly added animal id.
			this.photoAdded(snapshot);
		}
	}

	downloadPhotosForAnimal(animalId) {
		console.log('downloadPhotosForAnimal for : ', animalId);
		DataServices.OnMatchingChildAdded(
			"photos",
			"animalId",
			animalId,
			this.photoAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			"photos",
			"animalId",
			animalId,
			this.photoDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			"photos",
			"animalId",
			animalId,
			this.photoChanged.bind(this));
	}

	// TODO: Only download the main photo per animal, not all of them, for the list view.
	downloadPhotosForGroup(groupId) {
		console.log('downloadPhotosForGroup for : ', groupId);
		DataServices.OnMatchingChildAdded(
			"photos",
			"groupId",
			groupId,
			this.photoAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			"photos",
			"groupId",
			groupId,
			this.photoDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			"photos",
			"groupId",
			groupId,
			this.photoChanged.bind(this));
	}

	handleAction(action) {
		switch (action.type) {
			case ActionConstants.GROUP_DELETED:
				// TODO: delete all linked photos to animls under the group
				break;
			case ActionConstants.ANIMAL_DELETED:
				// TODO: delete all linked photos to animal.
				break;
		default:
			break;
		}
	}
}

module.exports = new PhotoStore();
