
import DatabaseObject from '../databaseobjects/databaseobject';
import InputField from './inputfields/inputfield';

export abstract class Editor {
  protected databaseObject: DatabaseObject;
  protected inputFields: {}

  constructor(databaseObject) {
    this.databaseObject = databaseObject;
    this.init();
  }

  init() {
    this.createInputFields();

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

  abstract createInputFields();

  abstract getInputFields(): {};

  abstract insert(extraFields, onError, onSuccess);

  abstract update(extraFields, onError, onSuccess);

  delete() : Promise<any> {
    return this.databaseObject.delete();
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
