
import DatabaseObject from '../databaseobjects/databaseobject';
import InputField from '../inputfield';

export abstract class Editor {
	protected databaseObject: DatabaseObject;
	protected inputFields: {}

	abstract getInputFields(): {};

	abstract insert(user);

	abstract update();

	delete() {
		this.databaseObject.delete();
	}

	validateFields() {
		var errorFound = false;
		for (var key in this.inputFields) {
			var field = this.inputFields[key];
			field.validate();
			if (field.hasError) {
				console.log('Error found with field ' + field.ref);
				errorFound = true;
			}
		}
		return !errorFound;
	}
}
