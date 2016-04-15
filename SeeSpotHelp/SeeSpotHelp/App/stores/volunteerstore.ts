'use strict';

import Volunteer from '../core/volunteer';
import BaseStore from './basestore';

class VolunteerStore extends BaseStore {
	protected databaseObject: Volunteer = new Volunteer('', '');

	constructor() {
		super();
		this.Init();
	}

	getVolunteerById(userId) {
		return this.getItemById(userId);
	}
};

export default new VolunteerStore();
