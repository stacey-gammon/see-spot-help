'use strict';

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var DataServices = require('../core/dataservices');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

class BaseStore extends EventEmitter {
	constructor() {
		super();
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

	downloadItemsWithMatchingProperty(
			firebasePath, property, value, onAdded, onDeleted, onChanged) {
		DataServices.OnMatchingChildAdded(
			firebasePath,
			property,
			value,
			onAdded.bind(this));
		DataServices.OnMatchingChildRemoved(
			firebasePath,
			property,
			value,
			onDeleted.bind(this));
		DataServices.OnMatchingChildChanged(
			firebasePath,
			property,
			value,
			onChanged.bind(this));
	}
}

module.exports = BaseStore;
