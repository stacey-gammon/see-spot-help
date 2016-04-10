'use strict';

import Volunteer = require('../core/volunteer');
import BaseStore = require('./basestore');

class VolunteerStore extends BaseStore {
	protected databaseObject: Volunteer = new Volunteer('', '', '');

	constructor() {
		super();
		this.Init();
	}

	getVolunteerById(userId) {
		return this.getItemById(userId);
	}
};

export = new VolunteerStore();
