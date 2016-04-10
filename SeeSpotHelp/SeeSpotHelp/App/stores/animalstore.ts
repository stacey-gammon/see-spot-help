'use strict';

import Animal = require("../core/animal");
import BaseStore = require('./basestore');

class AnimalStore extends BaseStore {
	protected databaseObject: Animal = new Animal();

	constructor() {
		super();
		this.Init();
	}

	getAnimalById(id) {
		return this.getItemById(id);
	}

	getAnimalsByUser(userId) {
		return this.getItemsByProperty('userId', userId);
	}

	getAnimalsByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}
}

export = new AnimalStore();
