
import AnimalActivityItem from '../databaseobjects/animalnote';

import InputField from './inputfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class AcitivtyEditor extends Editor {
	public databaseObject: AnimalActivityItem;

	constructor(group) {
		super();
		this.databaseObject = group;
		this.createInputFields();
	}

	getInputFields() { return this.inputFields; }

	insert(user) {
		var activity = new AnimalActivityItem()
		activity.updateFromInputFields(this.inputFields);
		activity.insert();
		this.databaseObject = activity;
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
