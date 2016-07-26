
import DatabaseObject from '../databaseobjects/databaseobject';
import Group from '../databaseobjects/group';
import PermissionsStore from '../../stores/permissionsstore';
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
    return this.deleteLinkedChildren()
        .then(() => {
          console.log('Editor.delete, children deleted, now deleting itself: ', this.databaseObject);
          return this.databaseObject.shallowDelete();
        }).then(() => {
          console.log('Deleting the groups permissions');
          // The very last thing for deleting a group is deleting it's permissions.  If we delete
          // them beforehand, we won't be able to delete it.
          if (this.databaseObject.className == new Group().className) {
            return this.deleteLinkedChildrenOfType(PermissionsStore);
          }
        })
        .catch((error) => {
            console.log('Error during Editor.delete: ', error);
            throw error;
        });
  }

  deleteLinkedChildren() : Promise<any> {
    console.log('Delete linked children');
    let promises = [];
    for (let i = 0; i < this.linkedChildrenStores.length; i++) {
      promises.push(this.deleteLinkedChildrenOfType(this.linkedChildrenStores[i]));
    }
    return Promise.all(promises);
  }

  deleteLinkedChildrenOfType(store: BaseStore) : Promise<any> {
    console.log('Deleting children of type ', store);
    if (!this.externalId) {
      throw new Error('Must supply externalId field for type ' + this.databaseObject.className);
    }
    return store.ensureItemsByProperty(this.externalId, this.databaseObject.id)
        .then((items: Array<DatabaseObject>) => {
          let deletes = {};
          console.log('Deleteing all items of ' + this.externalId + ' and id ' + this.databaseObject.id);
          for (let i = 0; i < items.length; i++) {
            Object.assign(deletes, items[i].getDeletePaths());
          }
          return DataServices.DeleteMultiple(deletes);
        }, (error) => {
          console.log('Error ensuring all items by property ' +
                        this.externalId + ' and value ' + this.databaseObject.id);
          console.log('Failed with error ', error);
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
