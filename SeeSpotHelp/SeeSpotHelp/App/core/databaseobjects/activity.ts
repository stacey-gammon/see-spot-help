'use strict';

var dateFormat = require('dateformat');

import DataServices from '../dataservices';
import DatabaseObject from './databaseobject';

export default class Activity extends DatabaseObject {
	public description: string = '';
	public userId: string;
	public animalId: string;
	public groupId: string;

	// For auto-generated activities.
	public photoId: string;
	public eventId: string;

	constructor() {
		super();
		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance() { return new Activity(); }

	getDateForDisplay() {
		return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
	}

	isPhotoActivity() { return false; }
	editable() { return true; }
}
