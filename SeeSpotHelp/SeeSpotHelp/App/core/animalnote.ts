
var DataServices = require('./dataservices');
var dateFormat = require('dateformat');
import { DatabaseObject } from './databaseobject';


class AnimalNote extends DatabaseObject {
	public note: string;
	public userId: string;
	public animalId: string;
	public groupId: string;
	public classNameForSessionStorage: string = 'AnimalNote';
	public firebasePath: string = 'notes/';

	constructor() {
		super();
	}

	getDateForDisplay() {
		return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
	}

	toDisplayString() {
		return this.note;
	}

	public static castObject(obj) {
		var group = new AnimalNote();
		group = Object.assign(group, obj);
		return group;
	}
}

export = AnimalNote;
