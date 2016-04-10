'use strict';

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
import DataServices = require('../core/dataservices');
import Events = require('events');
import DatabaseObject = require('../core/databaseobject');

var EventEmitter = Events.EventEmitter;
var CHANGE_EVENT = "change";

abstract class BaseStore extends EventEmitter {
	protected storage: Object = {};
	// A blank representation of the item this store contains:
	protected abstract databaseObject: DatabaseObject;
	protected storageMappings: Object = {};
	protected firebasePath: string;
	public errorMessage: string;
	public hasError: boolean = false;

	constructor() {
		super();
	}

	Init() {
		this.firebasePath = this.databaseObject.firebasePath;
		for (var i = 0; i < this.databaseObject.mappingProperties.length; i++) {
			var property = this.databaseObject.mappingProperties[i];
			this.storageMappings[property] = {};
		}
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	getItemById(id) {
		if (!this.storage.hasOwnProperty(id)) {
			this.storage[id] = null;
			this.downloadItem(id);
		}
		return this.storage[id];
	}

	deleteFromMapping(mapping, key, deletedId) {
		for (var i = 0; i < mapping[key].length; i++) {
			var id = mapping[key][i];
			if (id == deletedId) {
				mapping[key].splice(i, 1);
				return;
			}
		}
	}

	addIdToMapping(mapping, key, id) {
		if (!mapping[key]) {
			mapping[key] = [];
		}
		mapping[key].push(id);
	}

	itemDownloaded(id: string, snapshot) {
		if (snapshot && snapshot.val() && !this.storage.hasOwnProperty[id]) {
			this.itemAdded(snapshot);
		} else if (snapshot && snapshot.val()) {
			this.itemChanged(snapshot);
		} else {
			this.itemDeletedWithId(id);
		}
	}

	itemAdded(snapshot) {
		if (snapshot.val()) {
			var casted = this.databaseObject.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!casted.id) return;

			for (var prop in this.storageMappings) {
				this.addIdToMapping(this.storageMappings[prop], casted[prop], casted.id);
			}
			this.storage[casted.id] = casted;

			this.emitChange();
		}
	}

	itemDeleted(snapshot) {
		var deletedObject = <DatabaseObject>snapshot.val();
		this.itemDeletedWithId(deletedObject.id);
	}

	itemDeletedWithId(id) {
		var deletedObject = this.storage[id];
		this.storage[id] = null;

		for (var prop in this.storageMappings) {
			this.deleteFromMapping(
				this.storageMappings[prop], deletedObject[prop], id);
		}
	}

	itemChanged(snapshot) {
		var changedObject = this.databaseObject.castObject(snapshot.val());
		if (this.storage.hasOwnProperty(changedObject.id)) {
			this.storage[changedObject.id] = changedObject;
			this.emitChange();
		} else {
			this.itemAdded(snapshot);
		}
	}

	getItemsByProperty(property, propertyValue) {
		var storageMapping = this.storageMappings[property];
		if (!storageMapping.hasOwnProperty(propertyValue)) {
			storageMapping[propertyValue] = [];
			this.downloadFromMapping(property, propertyValue);
			return null;
		}

		var items = [];
		for (var i = 0; i < storageMapping[propertyValue].length; i++) {
			items.push(this.storage[storageMapping[propertyValue][i]]);
		}

		return items;
	}

	errorOccurred(errorObject) {
		if (errorObject) {
			this.errorMessage = errorObject.message;
			this.hasError = true;
			this.emitChange();
		}
	}

	resetErrorInfo() {
		this.errorMessage = '';
		this.hasError = false;
	}

	downloadItem(id) {
		this.resetErrorInfo();
		DataServices.DownloadData(
			this.firebasePath + '/' + id,
			this.itemDownloaded.bind(this, id),
			this.errorOccurred.bind(this));
	}

	downloadFromMapping(property, propertyValue) {
		this.resetErrorInfo();
		var path = DatabaseObject.GetPathToMapping(
			this.firebasePath,
			property,
			propertyValue);

		DataServices.OnChildAdded(path, this.itemAdded.bind(this));
		DataServices.OnChildChanged(path, this.itemChanged.bind(this));
		DataServices.OnChildRemoved(path, this.itemDeleted.bind(this));
	}
}

export = BaseStore;
