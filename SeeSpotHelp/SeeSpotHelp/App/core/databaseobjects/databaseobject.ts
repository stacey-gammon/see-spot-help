import DataServices from '../dataservices';
import Firebase = require('firebase');

var dateFormat = require('dateformat');

export enum Status {
  ACTIVE,
  ARCHIVED
}

abstract class DatabaseObject {
  public timestamp: number = Firebase.database.ServerValue.TIMESTAMP;
  public id: string;
  public className: string;
  public firebasePath;

  public status: Status = Status.ACTIVE;

  // If the object wants to store duplicate entries of itself, mapped by a particular unique
  // attribute, it should add the properties in here.
  public mappingProperties: Array<string> = [];

  constructor() {
    this.className = this.constructor.name;
    // Nest the paths on firebase for better organization with types that have multiple
    // mappings.
    this.firebasePath = this.className + '/' + this.className;
  }

  abstract createInstance();

  castObject(from) {
    var obj = this.createInstance();
    obj.copyFieldsFrom(from);
    return obj;
  }

  copyFieldsFrom(other) {
    for (var prop in other) {
      this[prop] = other[prop];
    }
  }

  getDateForDisplay() {
    return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
  }

  // Updates the instance based on the values entered by the user on an input form.
  // @param inputFields { { fieldName : InputField} } - A object where the keys
  // are the field name (e.g. "groupName", "shelterName") and the values are
  // InputFields which hold the values given by the user.
  updateFromInputFields(inputFields) {
    for (var prop in this) {
      if (inputFields.hasOwnProperty(prop)) {
        this[prop] = inputFields[prop].value;
      }
    }
  }

  public static GetPathToMapping(
      firebasePath: string,
      property: string,
      value: string|number,
      id?: string) {
    var specific = id ? id + '/' : '';
    return (
      firebasePath + 'By' + property.charAt(0).toUpperCase() + property.slice(1) + '/' +
      value + '/' +
      specific);
  }

  // Returns a path to the mapping for a particular unique property on this element. For instance
  // passing in userId for the Permissions object would return 'userPermissions/$myuserid/' where
  // $myuserid is the value of this.userId.
  getPathToMapping(propertyName: string): string {
    return DatabaseObject.GetPathToMapping(
      this.firebasePath,
      propertyName,
      this[propertyName],
      this.id);
  }

  insert() : Promise<any> {
    var inserts = this.getInserts();
    return DataServices.UpdateMultiple(inserts);
  }

  getInserts(): Object {
    this.id = DataServices.GetNewPushKey(this.firebasePath);
    if (!this.id) {
      console.log('WARN: null push key for path ' + this.firebasePath);
      return [];
    }
    return this.getUpdates();
  }

  update() : Promise<any> {
    var updates = this.getUpdates();
    return DataServices.UpdateMultiple(updates);
  }

  getUpdates(): Object {
    var updates = {};
    updates[this.firebasePath + '/' + this.id] = this;

    for (var i = 0; i < this.mappingProperties.length; i++) {
      if (!this[this.mappingProperties[i]]) {
        continue;
      }
      var path = this.getPathToMapping(this.mappingProperties[i]);
      updates[path] = this;
    }
    return updates;
  }

  delete() : Promise<any> {
    var deletes = {};
    var promises = [];
    deletes[this.firebasePath + '/' + this.id] = null;
    for (var i = 0; i < this.mappingProperties.length; i++) {
      if (!this[this.mappingProperties[i]]) {
        continue;
      }
      var path = this.getPathToMapping(this.mappingProperties[i]);
      deletes[path] = null;
    }
    return DataServices.DeleteMultiple(deletes);
  }

}
export default DatabaseObject;
