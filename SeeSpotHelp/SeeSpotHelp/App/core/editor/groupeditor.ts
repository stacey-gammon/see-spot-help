
import VolunteerGroup from '../databaseobjects/volunteergroup';

import InputField from '../inputfield';
import InputFieldValidation from '../inputfieldvalidation';
import { Editor } from './editor';

var STATES = [
	'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
	'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
	'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
	'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default class GroupEditor extends Editor {
	public databaseObject: VolunteerGroup;

	constructor(group) {
		super();
		this.databaseObject = group;
		this.createInputFields();
	}

	getInputFields() { return this.inputFields; }

	insert(user) {
		var group = VolunteerGroup.createFromInputFields(this.inputFields, user.id);
		group.insert(user);
		this.databaseObject = group;
	}

	update() {
		this.databaseObject.updateFromInputFields(this.inputFields);
		this.databaseObject.update();
	}

	createInputFields() {
		var IFV = InputFieldValidation;
		this.inputFields = {
			'name': new InputField([IFV.validateNotEmpty]),
			'shelter': new InputField([IFV.validateNotEmpty]),
			'address': new InputField([IFV.validateNotEmpty]),
			'city': new InputField([IFV.validateNotEmpty]),
			'state': new InputField([IFV.validateNotEmpty]),
			'zipCode': new InputField([IFV.validateNotEmpty])
		};

		// Store the ref name on the input field without manually
		// writing it out twice.
		for (var field in this.inputFields) {
			this.inputFields[field].ref = field;
		}
		if (this.databaseObject) {
			for (var field in this.inputFields) {
				this.inputFields[field].value = this.databaseObject[field];
			}
		}
	}
}
