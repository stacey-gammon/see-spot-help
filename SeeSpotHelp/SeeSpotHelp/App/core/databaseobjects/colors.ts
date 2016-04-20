import DatabaseObject from './databaseobject';

const Colors = {
	TEAL: '#008080', // Teal
	GREEN: '#347235', // Green
	CANTELOUP: '#FFA62F', // Canteloup
	REDFOX: '#C35817',  // Red Fox
	PLUM: '#7D0541',  // Plum
	PINK: '#FC6C85' // Pink
};

export default class Color extends DatabaseObject {
	constructor() {
		super();

		this.mappingProperties.push('userId');
		this.mappingProperties.push('groupId');
		this.mappingProperties.push('animalId');
	}

	createInstance() { return new Color(); }

	// TODO: do this correctly.
	public static GetAvailableColor() {
		return Colors.TEAL;
	}
}
