'use strict';

import Animal from "../core/animal";
import BaseStore from './basestore';

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

export default new AnimalStore();
