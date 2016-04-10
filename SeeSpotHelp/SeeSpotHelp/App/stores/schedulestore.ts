'use strict';

import Schedule = require('../core/schedule');
import BaseStore = require('./basestore');

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

export = new ScheduleStore();
