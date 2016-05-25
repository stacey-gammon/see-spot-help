
import Volunteer from '../databaseobjects/volunteer';

import InputTextAreaField from './inputfields/inputtextareafield';
import InputTextField from './inputfields/inputfield';
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
    return this.databaseObject.update();
  }

  createInputFields() {
    this.inputFields = {
      'email': new InputTextField([InputFieldValidation.validateNotEmpty]),
      'name': new InputTextField([InputFieldValidation.validateNotEmpty]),
      'aboutMe': new InputTextAreaField()
    };
  }
}
