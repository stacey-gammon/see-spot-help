
import Group from '../databaseobjects/group';

import InputField from './inputfields/inputfield';
import InputStateField from './inputfields/inputstatefield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';

import BaseStore from "../../stores/basestore";
import CommentStore from "../../stores/commentstore";
import PhotoStore from "../../stores/photostore";
import ActivityStore from "../../stores/activitystore";
import AnimalStore from "../../stores/animalstore";
import ScheduleStore from "../../stores/schedulestore";

export default class GroupEditor extends Editor {
  public databaseObject: Group;
  public externalId : string = 'groupId';
  public linkedChildrenStores: Array<BaseStore> = [
    CommentStore,
    PhotoStore,
    ActivityStore,
    ScheduleStore,
    AnimalStore
  ];

  constructor(group) {
    super(group);
  }

  getInputFields() { return this.inputFields; }

  insert() {
    var group = new Group();
    group.updateFromInputFields(this.inputFields);
    var promise = group.insert();
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
      'shelter': new InputField(),
      'address': new InputField(),
      'city': new InputField(),
      'state': new InputStateField(),
      'zipCode': new InputField()
    };
  }
}
