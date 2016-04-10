'use strict';

import AnimalNote from '../core/animalnote';
import BaseStore from './basestore';

class AnimalActivityStore extends BaseStore {
	protected databaseObject: AnimalNote = new AnimalNote();

	constructor() {
		super();
		this.Init();
	}

	getActivityById(id) {
		return this.getItemById(id);
	}

	getActivityByUserId(userId) {
		return this.getItemsByProperty('userId', userId);
	}

	getActivityByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}

	getActivityByAnimalId(animalId) {
		return this.getItemsByProperty('animalId', animalId);
	}
};

export default new AnimalActivityStore();
