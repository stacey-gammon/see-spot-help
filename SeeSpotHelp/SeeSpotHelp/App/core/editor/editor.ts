
import DatabaseObject from '../databaseobjects/databaseobject';
import InputField from './inputfields/inputfield';
import DataServices from '../dataservices';
import BaseStore from '../../stores/basestore';

export abstract class Editor {
  protected databaseObject: DatabaseObject;
  public inputFields: {}
  public errorMessage: string;
  public linkedChildrenStores: Array<BaseStore> = [];
  public externalId : string = '';

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
    let me = this;
    return new Promise(function(resolve, reject) {
      me.deleteLinkedChildren().then(
        function () {
          console.log('deleting me');
          me.databaseObject.shallowDelete().then(
            resolve,
            function (error) {
              console.log('Error with shallow delete on object ', me.databaseObject);
              reject(error);
            });
        }).catch(
          function (error) {
            console.log('Error deleting linked children: ', error);
            reject(error);
          });
    });
  }

  deleteLinkedChildren() : Promise<any> {
    let promises = [];
    for (let i = 0; i < this.linkedChildrenStores.length; i++) {
      promises.push(this.deleteLinkedChildrenOfType(this.linkedChildrenStores[i]));
    }
    return Promise.all(promises);
  }

  deleteLinkedChildrenOfType(store: BaseStore) : Promise<any> {
    let me = this;
    return new Promise(function(resolve, reject) {
      let deletes = {};
      store.ensureItemsByProperty(me.externalId, me.databaseObject.id).then(
        function(items: Array<DatabaseObject>) {
          for (let i = 0; i < items.length; i++) {
            Object.assign(deletes, items[i].getDeletePaths());
          }
          DataServices.DeleteMultiple(deletes).then(
            resolve,
            function(error) {
              console.log('Failed to delete: ', deletes);
              reject(error);
            });
        }).catch(function (error) {
          console.log('Error ensuring all items by property ' +
                        me.externalId + ' and value ' + me.databaseObject.id);
          console.log('Failed with error ', error);
          reject(error);
        });
    });
  }

  validateFields() : boolean {
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
