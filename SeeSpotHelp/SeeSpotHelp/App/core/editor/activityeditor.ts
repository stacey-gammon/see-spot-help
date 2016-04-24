
import Activity from '../databaseobjects/activity';

import InputTextAreaField from './inputtextareafield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class AcitivtyEditor extends Editor {
	public databaseObject: Activity;

	constructor(activity) {
		super(activity);
	}

	getInputFields() { return this.inputFields; }

	insert(extraFields) {
		var activity = new Activity()
		activity.updateFromInputFields(this.inputFields);
		activity.groupId = extraFields.groupId;
		activity.animalId = extraFields.animalId;
		activity.userId = extraFields.userId;
		activity.insert();
		this.databaseObject = activity;
	}

	update() {
		this.databaseObject.updateFromInputFields(this.inputFields);
		this.databaseObject.update();
	}

	createInputFields() {
		this.inputFields = {
			'description': new InputTextAreaField([InputFieldValidation.validateNotEmpty])
		};
	}
}
