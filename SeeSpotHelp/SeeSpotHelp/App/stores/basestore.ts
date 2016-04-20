'use strict';

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
import Events = require('events');
import Promise = require('bluebird');

import DataServices from '../core/dataservices';
import DatabaseObject from '../core/databaseobjects/databaseobject';

var EventEmitter = Events.EventEmitter;
var CHANGE_EVENT = "change";

enum EventTypeEnum {
	INSERT,
	UPDATE,
	DELETE,
	ALL
};

class PropertyListener {
	public property: string = null;
	public value: any;
	public callback: any;
	public listener: any;

	constructor(listener, property, value, callback) {
		this.listener = listener;
		this.property = property;
		this.value = value;
		this.callback = callback;
	}
}

abstract class BaseStore extends EventEmitter {
	protected storage: Object = {};
	// A blank representation of the item this store contains:
	protected databaseObject: DatabaseObject;
	protected storageMappings: Object = {};
	protected firebasePath: string;
	public errorMessage: string;
	public hasError: boolean = false;
	private isDownloading: boolean = false;
	private promiseResolveCallbacks: Array<any> = [];
	private propertyListeners: Array<PropertyListener> = [];
	private itemListeners: Array<PropertyListener> = [];

	// Mapping of EventTypeEnum to an array of object with a callback and potentially an id.
	private listenerInfo = {
		INSERT: [],
		UPDATE: [],
		DELETE: [],
		ALL: []
	};

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

	addPropertyListener(listener, property, value, callback) {
		this.propertyListeners.push(new PropertyListener(listener, property, value, callback));
	}

	removePropertyListener(listener) {
		for (var i = 0; i < this.propertyListeners.length; i++) {
			var propListener = this.propertyListeners[i];
			if (propListener.listener == listener) {
				this.propertyListeners.slice(i, i + 1);
			}
		}
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	resolvePromises(id) {
		for (var i = 0; i < this.promiseResolveCallbacks.length; i++) {
			this.promiseResolveCallbacks[i]();
		}
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	emitChange(property?, value?) {
		this.emit(CHANGE_EVENT);
		if (property) {
			for (var i = 0; i < this.propertyListeners.length; i++) {
				var propListener = this.propertyListeners[i];
				if (propListener.property == property &&
					propListener.value == value) {
					propListener.callback();
				}
			}
		}
	}

	ensureItemById(id) {
		var promise = new Promise(function(resolve, reject) {
			var onResolve = function (data) {
				resolve(data)
			};
			var onReject = function (error) {
				reject(error);
			};
			if (!this.storage.hasOwnProperty(id)) {
				this.storage[id] = null;
				this.downloadItem(id, onResolve, onReject);
			} else if (!this.isDownloading){
				resolve(this.storage[id]);
			} else {
				this.promiseResolveCallbacks.push(onResolve);
			//	reject('Already waiting on the download.');
			}
		}.bind(this));
		return promise;
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
		if (!mapping) return;
		if (!mapping[key]) {
			mapping[key] = [];
		}
		mapping[key].push(id);
	}

	itemDownloaded(id: string, onSuccess, snapshot) {
		this.isDownloading = false;
		if (snapshot && snapshot.val() && !this.storage.hasOwnProperty[id]) {
			this.itemAdded('id', snapshot);
		} else if (snapshot && snapshot.val()) {
			this.itemChanged('id', snapshot);
		} else {
			this.itemDeletedWithId(id);
		}
		if (onSuccess) { onSuccess(); }
		this.resolvePromises(id);
	}

	itemAdded(prop, snapshot) {
		if (snapshot.val()) {
			var casted = this.databaseObject.castObject(snapshot.val());
			// Wait for the subsequent update to set the id.
			if (!casted.id) return;
			if (prop) {
				this.addIdToMapping(this.storageMappings[prop], casted[prop], casted.id);
			}
			this.storage[casted.id] = casted;

			this.emitChange(prop, casted[prop]);
		}
	}

	itemDeleted(snapshot) {
		var deletedObject = <DatabaseObject>snapshot.val();
		this.itemDeletedWithId(deletedObject.id);
	}

	itemDeletedWithId(id) {
		var deletedObject = this.storage[id];
		this.storage[id] = null;

		if (deletedObject) {
			for (var prop in this.storageMappings) {
				this.deleteFromMapping(
					this.storageMappings[prop], deletedObject[prop], id);
			}
		}
	}

	itemChanged(prop, snapshot) {
		var changedObject = this.databaseObject.castObject(snapshot.val());
		if (this.storage.hasOwnProperty(changedObject.id)) {
			this.storage[changedObject.id] = changedObject;
			this.emitChange();
		} else {
			this.itemAdded(prop, snapshot);
		}
	}

	getItemsByProperty(property, propertyValue) {
		var storageMapping = this.storageMappings[property];
		if (!storageMapping.hasOwnProperty(propertyValue)) {
			console.log(this.databaseObject.classNameForSessionStorage + ':getItemsByProperty(' + property + ', ' + propertyValue + ')');
			storageMapping[propertyValue] = [];
			this.downloadFromMapping(property, propertyValue);
			return [];
		}

		var items = [];
		for (var i = 0; i < storageMapping[propertyValue].length; i++) {
			items.push(this.storage[storageMapping[propertyValue][i]]);
		}

		return items;
	}

	errorOccurred(onError, errorObject) {
		this.isDownloading = false;
		if (errorObject) {
			this.errorMessage = errorObject.message;
			this.hasError = true;
			this.emitChange();
			if (onError) {
				onError(errorObject);
			}
		}
	}

	resetErrorInfo() {
		this.errorMessage = '';
		this.hasError = false;
	}

	downloadItem(id, onSuccess?, onError?) {
		this.isDownloading = true;
		this.resetErrorInfo();
		DataServices.DownloadData(
			this.firebasePath + '/' + id,
			this.itemDownloaded.bind(this, id, onSuccess),
			this.errorOccurred.bind(this, onError));
	}

	downloadFromMapping(property, propertyValue) {
		this.resetErrorInfo();
		var path = DatabaseObject.GetPathToMapping(
			this.firebasePath,
			property,
			propertyValue);

		DataServices.OnChildAdded(path, this.itemAdded.bind(this, property));
		DataServices.OnChildChanged(path, this.itemChanged.bind(this, property));
		DataServices.OnChildRemoved(path, this.itemDeleted.bind(this));
	}
}

export default BaseStore;
