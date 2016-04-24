
import DataServices from '../dataservices';
import StringUtils from '../stringutils';
import DatabaseObject from './databaseobject';

// An animal that is currently being managed by a volunteer group.

export default class Animal extends DatabaseObject {

	public name: string = '';
	public type: string = 'Dog';
	public description: string = '';
	public breed: string = '';
	public age: number = null;
	public status: number = Animal.StatusEnum.ADOPTABLE;
	public groupId: string;
	public userId: string;

	// Only used for searching:
	public zipCode: string;
	public shelter: string;
	public city: string;
	public state: string;

	public static StatusEnum = Object.freeze(
		{
			ADOPTABLE: 0,  // Animal is currently up for adoption.
			RESCUEONLY: 1,  // Animal can be adopted to rescue groups only.
			MEDICAL: 2,  // Animal is not up for adoption due to medical reasons.
			ADOPTED: 3,  // Animal has been adopted, YAY!
			PTS: 4,  // Animal has been put to sleep. :*(
			NLL: 5,  // Animal is No Longer Living due to other reasons.  Can be
			// used instead of PTS if people would prefer not to specify,
			// or if animal died of other causes.
			OTHER: 6 // In case I'm missing any other circumstances...
		}
	)

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
}
