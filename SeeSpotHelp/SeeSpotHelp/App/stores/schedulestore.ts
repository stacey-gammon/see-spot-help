'use strict';

import Schedule from '../core/databaseobjects/schedule';
import BaseStore from './basestore';

class ScheduleStore extends BaseStore {
	protected databaseObject: Schedule = new Schedule();

	constructor() {
		super();
		this.Init();
	}

	getScheduleById(id) {
		return this.getItemById(id);
	}

	getScheduleByMember(userId) {
		return this.getItemsByProperty('userId', userId);
	}

	getScheduleByGroup(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}

	getScheduleByAnimalId(animalId) {
		return this.getItemsByProperty('animalId', animalId);
	}
}

export default new ScheduleStore();
