'use strict';

import Events = require('events');
import Promise = require('bluebird');

import DataServices from '../core/dataservices';
import DatabaseObject from '../core/databaseobjects/databaseobject';
import { Status } from '../core/databaseobjects/databaseobject';

var EventEmitter = Events.EventEmitter;
var CHANGE_EVENT = "change";

enum EventTypeEnum {
  INSERT,
  UPDATE,
  DELETE,
  ALL
};

class PropertyListener {
  public property: string = null;
  public value: any;
  public callback: any;
  public listener: any;

  constructor(listener, property, value, callback) {
    this.listener = listener;
    this.property = property;
    this.value = value;
    this.callback = callback;
  }
}

abstract class BaseStore extends EventEmitter {
  protected storage: Object = {};
  // A blank representation of the item this store contains:
  protected databaseObject: DatabaseObject;
  protected storageMappings: Object = {};
  protected firebasePath: string;
  public errorMessage: string;
  public hasError: boolean = false;
  private isDownloading: any = {};
  private promiseResolveCallbacks: Array<any> = [];
  private propertyListeners: Array<PropertyListener> = [];
  private itemListeners: Array<PropertyListener> = [];
  private currentlyDownloading = {};

  // A map of properties to property values to the oldest element's id.
  private storageMappingLastId = {};

  // Mapping of EventTypeEnum to an array of object with a callback and potentially an id.
  private listenerInfo = {
    INSERT: [],
    UPDATE: [],
    DELETE: [],
    ALL: []
  };

  constructor() {
    super();

    DataServices.OnAuthStateChanged(() => this.Reset());
  }

  Reset() {
    this.storageMappingLastId = {};
    this.storageMappings = {};
    this.isDownloading = {};
    this.currentlyDownloading = {};
    this.propertyListeners = [];
    this.itemListeners = [];
    this.promiseResolveCallbacks = [];
    this.hasError = false;


    this.Init();
  }

  Init() {
    this.firebasePath = this.databaseObject.firebasePath;
    for (var i = 0; i < this.databaseObject.mappingProperties.length; i++) {
      var property = this.databaseObject.mappingProperties[i];
      this.storageMappings[property] = {};
      this.storageMappingLastId[property] = {};
      this.currentlyDownloading[property] = {};
    }
  }

  getOldestItemId(property, value) {
    return this.storageMappingLastId[property][value];
  }

  addPropertyListener(listener, property, value, callback) {
    // First make sure we aren't inserting a duplicate listener which can throw us into a
    // forever loop.
    for (var i = 0; i < this.propertyListeners.length; i++) {
      var propListener = this.propertyListeners[i];
      if (propListener.listener == listener &&
          propListener.property == property &&
          propListener.value == value) {
        return;
      }
    }
    this.propertyListeners.push(new PropertyListener(listener, property, value, callback));
  }

  removePropertyListener(listener) {
    for (var i = 0; i < this.propertyListeners.length; i++) {
      var propListener = this.propertyListeners[i];
      if (propListener.listener == listener) {
        this.propertyListeners.splice(i, i + 1);
      }
    }
  }

  addChangeListener(callback) {
    console.log('addChangeListener: ', callback);
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange(property?, value?) {
    this.emit(CHANGE_EVENT);
    this.emitChangeByProperty(property, value);
  }

  emitChangeByProperty(property, value) {
    if (property) {
      for (let i = 0; i < this.propertyListeners.length; i++) {
        let propListener = this.propertyListeners[i];
        if (propListener.property == property &&
          propListener.value == value) {
          console.log('Going to call ', propListener.callback);
          setTimeout(propListener.callback);
        }
      }
    }
  }

  resolvePromises(data) {
    for (var i = 0; i < this.promiseResolveCallbacks.length; i++) {
      this.promiseResolveCallbacks[i](data);
    }
  }

  getItemById(id) {
    console.log(this.databaseObject.className + 'Store: getItemById(' + id + ')');
    if (!this.storage.hasOwnProperty(id)) {
      this.storage[id] = null;
      this.downloadItem(id);
    }
    return this.storage[id];
  }

  deleteFromMapping(mapping, key, deletedId) {
    if (!mapping[key]) { return; }
    for (var i = 0; i < mapping[key].length; i++) {
      var id = mapping[key][i];
      if (id == deletedId) {
        mapping[key].splice(i, 1);
        return;
      }
    }
  }

  addIdToMapping(mapping, key, id) {
    if (!mapping) return;
    if (!mapping[key]) {
      mapping[key] = [];
    }
    if (mapping[key].indexOf(id) >= 0) {
      console.log('WARN: attempting to insert duplicate element with id ' + id + ' and key ' + key);
    } else {
      mapping[key].push(id);
    }
  }

  itemExistsLocally(property: string, value: string) {
    if (property == 'id') {
      return this.storage.hasOwnProperty(value);
    } else {
      return this.itemExistsLocally('id', this.storageMappings[property][value]);
    }
  }

  ensureItemsByProperty(property, propertyValue, lengthLimit?: number) : Promise<any> {
    return new Promise(function(resolve, reject) {
      if (lengthLimit === 0) {
        resolve([]);
        return;
      }

      var storageMapping = this.storageMappings[property];
      if (!storageMapping.hasOwnProperty(propertyValue)) {
        console.log(this.databaseObject.className + 'Store: getItemsByProperty(' + property + ', ' + propertyValue + ')');
        storageMapping[propertyValue] = [];
        this.downloadFromMapping(property, propertyValue, lengthLimit).then(
            resolve,
            function(error) {
              console.log('Failed to download items with error: ', error);
              reject(error);
            });
        return;
      }

      var items = [];
      for (var i = 0; i < storageMapping[propertyValue].length; i++) {
        var item = this.storage[storageMapping[propertyValue][i]];
        if (item && item.status !== Status.ARCHIVED) {
          items.push(item);
        }
      }

      items.sort(function(a, b) {
        return a.timestamp < b.timestamp ? 1 : -1;
      });

      if (lengthLimit && items.length < lengthLimit) {
        let id = null;
        if (items.length > 0) {
          id = items[items.length - 1].id;
        }

        // Don't attempt to download more if there is none.
        if (id &&
            id != this.storageMappingLastId[property][propertyValue] &&
            !this.areItemsDownloading(property, propertyValue, id)) {
          this.downloadFromMapping(property,
                                   propertyValue,
                                   lengthLimit,
                                   id).then(resolve,
                                     function(error) {
                                       console.log('Failed to grab more items with error: ', error);
                                       reject(error);
                                     });
          return;
        }
      } else {
        resolve(items);
      }
    }.bind(this));
  }

  /**
  * Called to retrieve multiple items given the property and value pair.  E.g. download all
  * anmimals in a certain group by calling this on the AnimalStore with property 'groupId' and
  * propertyValue with the id of the group.
  */
  getItemsByProperty(property, propertyValue, lengthLimit?: number) {
    if (lengthLimit === 0) return [];

    var storageMapping = this.storageMappings[property];
    if (!storageMapping.hasOwnProperty(propertyValue)) {
      console.log(this.databaseObject.className + 'Store: getItemsByProperty(' + property + ', ' + propertyValue + ')');
      storageMapping[propertyValue] = [];
      this.downloadFromMapping(property, propertyValue, lengthLimit);
      return [];
    }

    var items = [];
    for (var i = 0; i < storageMapping[propertyValue].length; i++) {
      var item = this.storage[storageMapping[propertyValue][i]];
      if (item && item.status !== Status.ARCHIVED) {
        items.push(item);
      }
    }

    items.sort(function(a, b) {
      return a.timestamp < b.timestamp ? 1 : -1;
    });

    if (lengthLimit && items.length < lengthLimit) {
      let id = null;
      if (items.length > 0) {
        id = items[items.length - 1].id;
      }

      // Don't attempt to download more if there is none.
      if (id &&
          id != this.storageMappingLastId[property][propertyValue] &&
          !this.areItemsDownloading(property, propertyValue, id)) {
        this.downloadFromMapping(property,
                                 propertyValue,
                                 lengthLimit,
                                 id);
      }
    }
    return items;
  }

  /**
  * Called when items are downloaded via getItemsByProperty with a property/value pair (e.g.
  * retrieve all items with property 'groupId' and value 'groupidhere'. All items are
  * initially downloaded in bulk, after which a listener is set up for subsequent additions,
  * changes and deletions.
  */
  itemsDownloaded(property: string, value: string, lengthLimit: number, lastLimitId : string, snapshot) {
    console.log(this.databaseObject.className + 'Store: itemsDownloaded with value ' + value + ', limited to ' + lengthLimit + ' starting at ' + lastLimitId);
    let lastItemTimestamp = 0;
    let lastItemId = null;
    let items = snapshot.val();
    let itemsToSort = [];
    for (let id in items) {
      var item = items[id];
      itemsToSort.push(item);
      if (item.status == Status.ARCHIVED) continue;
      lastItemTimestamp = item.timestamp;
      lastItemId = item.id;

      if (lastLimitId && item.id == lastLimitId) continue;

      if (this.storageMappings[property][value].indexOf(id) >= 0) {
        // Exists locally, item must be updated.
        this.itemChanged(property, item);
      } else {
        if (lengthLimit) {
          console.log('adding item: ', item);
        }
        this.itemAdded(property, item);
      }
    }

    if (lastLimitId) {
      if (!this.currentlyDownloading[property][value]) {
        this.currentlyDownloading[property][value] = {};
      }
      this.currentlyDownloading[property][value][lastLimitId] = false;
    } else {
      this.currentlyDownloading[property][value] = false;
    }

    itemsToSort.sort(function(a, b) {
      return a.timestamp < b.timestamp ? 1 : -1;
    });

    lastItemId = itemsToSort.length ? itemsToSort[itemsToSort.length - 1].id : null;

    // If we asked for lengthLimit items but have less than that, we must have hit the end of
    // available items. Note - don't ever set lengthLimit to 1 or this won't work because we
    // always ask for and download the last avavilable item.
    let batchSmallerThanRequested = lengthLimit && itemsToSort.length < lengthLimit;

    if (batchSmallerThanRequested || !lengthLimit) {
      this.storageMappingLastId[property][value] = lastItemId;
    }

    // Don't emit a change if all we did was download the last available item and no more are left.
    if (!lastLimitId || lastItemId != lastLimitId) {
      this.emitChange(property, value);
    }

    this.addListeners(property, value);
  }

  /**
  * Very similar to downloadItem except returns a promise that will be called once the item is
  * downloaded.
  */
  ensureItemById(id) : Promise<DatabaseObject> {
    console.log(this.databaseObject.className + 'Store: ensureItemById(' + id + ')');
    return new Promise<DatabaseObject>(function(resolve, reject) {
      if (!this.storage.hasOwnProperty(id)) {
        this.storage[id] = null;
        this.downloadItem(id).then(resolve, reject);
      } else if (!this.isDownloading[id]) {
        resolve(this.storage[id] as DatabaseObject);
      } else {
        console.log('WARN: Already downloading this item, we\'ll just have to download it again. ' +
                    'Try to improve this.');
        this.downloadItem(id).then(resolve, reject);
      }
    }.bind(this));
  }

  downloadItem(id) : Promise<DatabaseObject> {
    console.log(this.databaseObject.className + 'Store: downloadItem(' + id + ')');
    if (!id) {
      throw new Error('Id is null');
    }
    this.isDownloading[id] = true;
    this.resetErrorInfo();
    return DataServices.DownloadDataOnce(this.firebasePath + '/' + id)
        .then((snapshot) => {
          this.itemDownloaded(id, snapshot);
          return this.storage[id];
        })
        .catch((error) => {
          console.log('Error downloading item: ', error);
          throw error;
        });
  }

  itemDownloaded(id: string, snapshot) {
    if (!id) {
      console.log('WARN: itemDownloaded being passed undefined id');
      return;
    }
    console.log(this.databaseObject.className + 'Store: itemDownloaded with id ' + id);
    this.isDownloading[id] = false;
    if (snapshot && snapshot.val() && !this.storage[id]) {
      this.itemAdded('id', snapshot.val());
      // This is the first time this item has been downloaded, we now need to register a listener
      // for future changes and deletions to make sure our stores stay up-to-date.
      DataServices.DownloadData(this.firebasePath + '/' + id,
                                this.itemChangedCallback.bind(this, id));
    } else  {
      this.itemChangedCallback(id, snapshot);
    }

    this.resolvePromises(this.storage[id]);
  }

  itemChangedCallback(id : string, snapshot) {
    console.log('itemChangedCallback for id ' + id + ' and snapshot: ', snapshot);
    if (snapshot && snapshot.val()) {
      let currentItem = this.getItemById(id);
      this.itemChanged('id', snapshot.val());
    } else if (snapshot &&
               !snapshot.val() &&
               this.storage.hasOwnProperty(id) &&
               this.storage[id]) {
      this.onChildRemoved('id', id, snapshot);
    } else {
      // Data requested that doesn't exist.
      console.log('WARN: Data requested that doesn\'t exist.');
      // Make sure we don't request it again.
      this.storage[id] = null;
    }
    this.emitChange('id', id);
  }

  itemAdded(prop, item) {
    console.log(this.databaseObject.className + 'Store: itemAdded with prop ' + prop);
    if (item) {
      var casted = this.databaseObject.castObject(item);
      // Wait for the subsequent update to set the id.
      if (!casted.id) return;

      // Add item to the mappings
      console.log(this.databaseObject.className + 'Store: added with prop ' + prop + ' and value ' + casted[prop] + ' and id ' + casted.id);
      // Note: We cannot add the item to all mappings or we won't know if we have everything available
      // and we'll be missing data.
      this.addIdToMapping(this.storageMappings[prop], casted[prop], casted.id);

      this.storage[casted.id] = casted;
    }
    console.log(this.databaseObject.className + 'Store: itemAdded with prop ' + prop + ' GOODBYTE');
  }

  itemDeletedWithId(id) {
    console.log(this.databaseObject.className + 'Store: itemDeleted with id ' + id);
    var deletedObject = this.storage[id];

    if (deletedObject) {
      for (var prop in this.storageMappings) {
        this.deleteFromMapping(
          this.storageMappings[prop], deletedObject[prop], id);
      }
    }
    delete this.storage[id];
  }

  itemChanged(prop, snapshot, emit?: boolean) {
    console.log(this.databaseObject.className + 'Store: itemChanged with prop ' + prop);
    var changedObject = this.databaseObject.castObject(snapshot);
    if (this.storage.hasOwnProperty(changedObject.id)) {
      console.log(this.databaseObject.className + 'Store: itemChanged with id ' + changedObject.id + ' and prop ' + prop);
      this.storage[changedObject.id] = changedObject;
    } else {
      this.itemAdded(prop, snapshot);
    }
  }

  errorOccurred(id, onError, errorObject) {
    this.isDownloading[id] = false;
    if (errorObject) {
      this.errorMessage = errorObject.message;
      this.hasError = true;
      this.emitChange();
      if (onError) {
        onError(errorObject);
      }
    }
  }

  resetErrorInfo() {
    this.errorMessage = '';
    this.hasError = false;
  }

  areItemsDownloading(property, value, id?) {
    if (id) {
      if (!this.currentlyDownloading[property][value]) {
        this.currentlyDownloading[property][value] = {};
      }
      return this.currentlyDownloading[property][value][id];
    } else {
      if (typeof this.currentlyDownloading[property][value] === 'object') {
        for (let id in this.currentlyDownloading[property][value]) {
          if (this.currentlyDownloading[property][value][id]) {
            return true;
          }
        }
        return false;
      }
      return this.currentlyDownloading[property][value];
    }
  }

  isItemDownloading(id) {
    return this.isDownloading[id];
  }

  downloadFromMapping(property, value, lengthLimit? : number, id? : string) : Promise<any> {
    if (lengthLimit) {
      console.log('downloading last ' + lengthLimit + ' starting at ' + id);
    }
    this.resetErrorInfo();
    if (id) {
      if (!this.currentlyDownloading[property][value]) {
        this.currentlyDownloading[property][value] = {};
      }
      this.currentlyDownloading[property][value][id] = true;
    } else {
      this.currentlyDownloading[property][value] = true;
    }
    var path = DatabaseObject.GetPathToMapping(this.firebasePath, property, value);

    return new Promise(function(resolve, reject) {
      DataServices.DownloadDataOnce(path,
                                    lengthLimit,
                                    id)
          .then(
            function(snapshot) {
              this.itemsDownloaded(property, value, lengthLimit, id, snapshot);
              resolve(this.getItemsByProperty(property, value));
            }.bind(this),
            reject);
    }.bind(this));
  }

  onChildAdded(property, snapshot) {
    console.log('onChildAdded property ' + property + ' and snapshot ', snapshot);
    this.itemAdded(property, snapshot.val());
    console.log('onChildAdded emitting change');
    this.emitChange(property, snapshot.val()[property]);
  }

  onChildChanged(property, snapshot) {
    this.itemChanged(property, snapshot.val());
    this.emitChange(property, snapshot.val()[property]);
  }

  onChildRemoved(property, value, snapshot) {
    console.log(this.databaseObject.className + 'Store:onChildRemoved(' + property + ',' + value + ': ', snapshot.val());
    let databaseObject = snapshot.val() as DatabaseObject;
    if (!databaseObject && property == 'id') {
      databaseObject = this.storage[value];
    }

    console.log(this.databaseObject.className + 'Store:onChildRemoved(' + property + ',' + value + ', with dbobj ', databaseObject);

    this.itemDeletedWithId(databaseObject.id);

    for (let prop in this.storageMappings) {
      this.emitChangeByProperty(prop, databaseObject[prop]);
    }
    this.emitChange();
  }

  addListeners(property, value) {
    console.log(this.databaseObject.className + 'Store: addListeners for ' + property + ' and val ' + value);
    var path = DatabaseObject.GetPathToMapping(
        this.firebasePath,
        property,
        value);

    let lastId = this.getOldestItemId(property, value);
    DataServices.OnChildAdded(path, this.onChildAdded.bind(this, property), lastId);
    DataServices.OnChildChanged(path, this.onChildChanged.bind(this, property));
    DataServices.OnChildRemoved(path, this.onChildRemoved.bind(this, property, value));
  }
}

export default BaseStore;
