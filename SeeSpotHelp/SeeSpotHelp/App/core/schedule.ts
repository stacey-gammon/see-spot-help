
import DatabaseObject = require('./databaseobject');

class Schedule extends DatabaseObject {
	public start: string;
	public end: string;
	public title: string;
	public allDay: boolean = false;
	public description: string;
	public userId: string;
	public animalId: string;
	public groupId: string;
	public classNameForSessionStorage: string = 'Schedule';
	public firebasePath: string = 'schedule';

	constructor() {
		super();

		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance(): Schedule { return new Schedule(); }
}

export = Schedule;
