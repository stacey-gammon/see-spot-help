
import Animal from '../databaseobjects/animal';

import InputField from './inputfield';
import InputListField from './inputlistfield';
import InputTextAreaField from './inputtextareafield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

export default class AnimalEditor extends Editor {
  public databaseObject: Animal;

  constructor(activity) {
    super(activity);
  }

  getInputFields() { return this.inputFields; }

  insert(extraFields) {
    var animal = new Animal()
    animal.updateFromInputFields(this.inputFields);
    animal.groupId = extraFields.groupId;
    animal.copyGroupFields(extraFields);
    animal.userId = extraFields.userId;
    var promise = animal.insert();
    this.databaseObject = animal;
    return promise;
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    return this.databaseObject.update();
  }

  createInputFields() {
    var statusListItems = [
      "Adoptable", "Rescue Only", "Adopted", "Rescued", "All dogs go to heaven"];
    // for short hand.
    var IFV = InputFieldValidation;
    this.inputFields = {
      "name": new InputField([IFV.validateNotEmpty]),
      "type": new InputListField(["Dog", "Cat", "Other"], [IFV.validateNotEmpty]),
      "status": new InputListField(statusListItems, [IFV.validateNotEmpty]),
      "breed": new InputField(),
      "age": new InputField([IFV.validateNumber]),
      "description": new InputTextAreaField()
    };
  }
}
