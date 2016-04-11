'use strict';

import AnimalNote from '../core/animalnote';
import BaseStore from './basestore';

class AnimalActivityStore extends BaseStore {
	protected databaseObject: AnimalNote = new AnimalNote();

	constructor() {
		super();
		this.Init();
	}

	public getActivityById(id) {
		return this.getItemById(id);
	}

	public getActivityByUserId(userId) {
		return this.getItemsByProperty('userId', userId);
	}

	public getActivityByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}

	public getActivityByAnimalId(animalId: string) {
		return this.getItemsByProperty('animalId', animalId);
	}
};

export default new AnimalActivityStore();
