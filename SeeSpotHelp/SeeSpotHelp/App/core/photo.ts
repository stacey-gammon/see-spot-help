
import DatabaseObject = require('./databaseobject');

class Photo extends DatabaseObject {
	public src: string;
	public comment: string;
	public userId: string;
	public groupId: string;
	public classNameForSessionStorage: string = 'Photo';
	public firebasePath: string = 'photos';

	constructor() {
		super();

		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance() { return new Photo(); }

}

export = Photo;
