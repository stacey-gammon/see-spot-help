
import Group from '../databaseobjects/group';

import InputField from './inputfields/inputfield';
import InputStateField from './inputfields/inputstatefield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class GroupEditor extends Editor {
  public databaseObject: Group;

  constructor(group) {
    super(group);
  }

  getInputFields() { return this.inputFields; }

  insert(extraFields) {
    var group = new Group();
    group.updateFromInputFields(this.inputFields);
    var promise = group.insert(extraFields.userId);
    this.databaseObject = group;
    return promise;
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    return this.databaseObject.update();
  }

  createInputFields() {
    var IFV = InputFieldValidation;
    this.inputFields = {
      'name': new InputField([IFV.validateNotEmpty]),
      'shelter': new InputField([IFV.validateNotEmpty]),
      'address': new InputField([IFV.validateNotEmpty]),
      'city': new InputField([IFV.validateNotEmpty]),
      'state': new InputStateField([IFV.validateNotEmpty]),
      'zipCode': new InputField([IFV.validateNotEmpty])
    };
  }
}
