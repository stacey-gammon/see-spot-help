
import Activity from '../databaseobjects/activity';

import InputTextAreaField from './inputfields/inputtextareafield';
import InputFieldValidation from './inputfieldvalidation';
import { Editor } from './editor';
import CommentStore from '../../stores/commentstore';
import BaseStore from '../../stores/basestore';

export default class AcitivtyEditor extends Editor {
  public databaseObject: Activity;
  public linkedChildrenStores: Array<BaseStore> = [CommentStore];
  public externalId : string = 'activityId';

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
    var promise = activity.insert();
    this.databaseObject = activity;
    return promise;
  }

  update() {
    this.databaseObject.updateFromInputFields(this.inputFields);
    return this.databaseObject.update();
  }

  createInputFields() {
    this.inputFields = {
      'description': new InputTextAreaField([InputFieldValidation.validateNotEmpty])
    };
  }
}
