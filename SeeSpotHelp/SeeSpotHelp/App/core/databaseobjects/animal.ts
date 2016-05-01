
import StringUtils from '../stringutils';
import DatabaseObject from './databaseobject';
import Photo from './photo';
import Schedule from './schedule';
import Activity from './activity';
import { Status } from './databaseobject';

// An animal that is currently being managed by a volunteer group.

enum AdoptionStatus {
	ADOPTABLE,
	ADOPTED,
	RESCUED,
	RESCUE_ONLY
}

export default class Animal extends DatabaseObject {

	public name: string = '';
	public type: string = 'Dog';
	public description: string = '';
	public breed: string = '';
	public age: number = null;
	public status: number = Status.ACTIVE;
	public adoptionStatus: number = AdoptionStatus.ADOPTABLE;
	public groupId: string;
	public userId: string;

	// Only used for searching:
	public zipCode: string;
	public shelter: string;
	public city: string;
	public state: string;

	constructor() {
		super();
		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
	}

	createInstance() { return new Animal(); }

	public static GetTypeOptions() {
		return [
			"Dog", "Cat", "Other"
		];
	}

	copyGroupFields(group) {
		// Add these fields for searching.
		this.zipCode = StringUtils.MakeSearchable(group.zipCode);
		this.shelter = StringUtils.MakeSearchable(group.shelter);
		this.city = StringUtils.MakeSearchable(group.city);
		this.state = StringUtils.MakeSearchable(group.state);
	}

	getDefaultPhoto() {
		if (this.type.toLowerCase() == 'cat') {
			return 'images/cat.png';
		} else if (this.type.toLowerCase() == 'dog') {
			return 'images/dog.png'
		} else {
			return 'images/other.jpg';
		}
	}

	delete() {
		this.status = Status.ARCHIVED;
		this.update();
		//super.delete();
		//this.deleteExternalReferences([new Photo(), new Schedule(), new Activity()]
		//);
	}
}
