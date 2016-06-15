
import Schedule from '../databaseobjects/schedule';

import InputTextAreaField from './inputfields/inputtextareafield';
import GroupSelectField from './inputfields/groupselectfield';
import AnimalSelectField from './inputfields/animalselectfield';
import InputField from './inputfields/inputfield';
import { InputFieldType } from './inputfields/inputfield';
import InputListField from './inputfields/inputlistfield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

import GroupStore from '../../stores/groupstore';
import AnimalStore from '../../stores/animalstore';
import LoginStore from '../../stores/loginstore';

export default class SchedulEditor extends Editor {
  public databaseObject: Schedule;

  constructor(activity) {
    super(activity);
  }

  getInputFields() { return this.inputFields; }

  insert(extraFields) {
    var schedule = new Schedule()
    schedule.updateFromInputFields(this.inputFields);
    schedule.userId = LoginStore.getUser().id;
    var promise = schedule.insert();
    this.databaseObject = schedule;
    return promise;
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    return this.databaseObject.update();
  }

  createInputFields() {
    this.inputFields = {
      'group': this.createGroupSelectField(),
      'animal': new AnimalSelectField([InputFieldValidation.validateNotEmpty]),
      'date': new InputField([InputFieldValidation.validateNotEmpty], InputFieldType.DATE),
      'startTime': new InputField([], InputFieldType.TIME),
      'endTime': new InputField([], InputFieldType.TIME),
      'description': new InputTextAreaField([])
    };
    if (this.databaseObject) {
      this.inputFields['user'] = new InputField([]);
    }
  }

  createGroupSelectField() {
    var inputField = new GroupSelectField([InputFieldValidation.validateNotEmpty]);
    inputField.onChange = this.fillAnimalDropDown.bind(this);
    return inputField;
  }

  fillAnimalDropDown() {
    this.inputFields['animal'].populate(this.inputFields['group'].value);
  }

  validateFields() : boolean {
    this.errorMessage = null;
    var errorFound = super.validateFields();
    var startTimeInputField = this.inputFields['endTime'];
    var endTimeInputField = this.inputFields['startTime'];

    if ((endTimeInputField.value && !startTimeInputField.value) ||
        (!endTimeInputField.value && startTimeInputField.value)) {
      this.errorMessage = 'Please enter both start and end time, or clear both.';
    }

    if (endTimeInputField.value && startTimeInputField.value) {
      var date = moment(this.inputFields['date'].value);
      var startDate =
          moment(date.format('MM-DD-YYYY') + ' ' + startTimeInputField.value, 'MM-DD-YYYY hh:mm a');
      var endDate =
          moment(date.format('MM-DD-YYYY') + ' ' + endTimeInputField.value, 'MM-DD-YYYY hh:mm a');

      if (endDate.isBefore(startDate)) {
        this.errorMessage = 'Start time must be before end time.';
      }
    }
    return errorFound || !!this.errorMessage;
  }
}
