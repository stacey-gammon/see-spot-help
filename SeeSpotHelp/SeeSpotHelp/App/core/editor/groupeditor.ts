
import Group from '../databaseobjects/group';

import InputField from './inputfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

var STATES = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
  'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

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
      'state': new InputField([IFV.validateNotEmpty]),
      'zipCode': new InputField([IFV.validateNotEmpty])
    };
  }
}
