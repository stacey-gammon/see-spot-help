
import DataServices = require('./dataservices');
import dateFormat = require('dateformat');
import DatabaseObject = require('./databaseobject');

class AnimalNote extends DatabaseObject {
	public note: string;
	public userId: string;
	public animalId: string;
	public groupId: string;
	public classNameForSessionStorage: string = 'AnimalNote';
	public firebasePath: string = 'notes';

	constructor() {
		super();
		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance() { return new AnimalNote(); }

	getDateForDisplay() {
		return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
	}

	toDisplayString() {
		return this.note;
	}
}

export = AnimalNote;
