
import Volunteer from '../databaseobjects/volunteer';

import InputTextAreaField from './inputtextareafield';
import InputTextField from './inputfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class ProfileEditor extends Editor {
  public databaseObject: Volunteer;

  constructor(activity) {
    super(activity);
  }

  getInputFields() { return this.inputFields; }

  insert() {
    console.log('ERROR: Cannot insert new volunteer through editor.');
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    this.databaseObject.update();
  }

  createInputFields() {
    this.inputFields = {
      'email': new InputTextField([InputFieldValidation.validateNotEmpty]),
      'name': new InputTextField([InputFieldValidation.validateNotEmpty]),
      'aboutMe': new InputTextAreaField()
    };
  }
}