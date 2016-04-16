
import DatabaseObject from './databaseobject';

export default class Schedule extends DatabaseObject {
	public start: string;
	public end: string;
	public title: string;
	public allDay: boolean = false;
	public description: string;
	public userId: string;
	public animalId: string;
	public groupId: string;

	constructor() {
		super();

		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance(): Schedule { return new Schedule(); }
}
