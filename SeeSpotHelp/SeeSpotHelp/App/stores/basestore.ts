'use strict';

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
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

  // Mapping of EventTypeEnum to an array of object with a callback and potentially an id.
  private listenerInfo = {
    INSERT: [],
    UPDATE: [],
    DELETE: [],
    ALL: []
  };

  constructor() {
    super();
  }

  Init() {
    this.firebasePath = this.databaseObject.firebasePath;
    for (var i = 0; i < this.databaseObject.mappingProperties.length; i++) {
      var property = this.databaseObject.mappingProperties[i];
      this.storageMappings[property] = {};
      this.currentlyDownloading[property] = {};
    }
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
        this.propertyListeners.slice(i, i + 1);
      }
    }
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange(property?, value?) {
    this.emit(CHANGE_EVENT);
    if (property) {
      for (var i = 0; i < this.propertyListeners.length; i++) {
        var propListener = this.propertyListeners[i];
        if (propListener.property == property &&
          propListener.value == value) {
          propListener.callback();
        }
      }
    }
  }

  resolvePromises(id) {
    for (var i = 0; i < this.promiseResolveCallbacks.length; i++) {
      this.promiseResolveCallbacks[i]();
    }
  }

  getItemById(id) {
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
    mapping[key].push(id);
  }

  itemExistsLocally(property: string, value: string) {
    if (property == 'id') {
      return this.storage.hasOwnProperty(value);
    } else {
      return this.itemExistsLocally('id', this.storageMappings[property][value]);
    }
  }

  /**
  * Called to retrieve multiple items given the property and value pair.  E.g. download all
  * anmimals in a certain group by calling this on the AnimalStore with property 'groupId' and
  * propertyValue with the id of the group.
  */
  getItemsByProperty(property, propertyValue) {
    var storageMapping = this.storageMappings[property];
    if (!storageMapping.hasOwnProperty(propertyValue)) {
      console.log(this.databaseObject.className + 'Store: getItemsByProperty(' + property + ', ' + propertyValue + ')');
      storageMapping[propertyValue] = [];
      this.downloadFromMapping(property, propertyValue);
      return [];
    }

    var items = [];
    for (var i = 0; i < storageMapping[propertyValue].length; i++) {
      var item = this.storage[storageMapping[propertyValue][i]];
      if (item) {
        items.push(item);
      } else {
        console.log('WARN: item in storage is null... are we downloading it?');
      }
    }
    items.sort(function(a,b) {
      return a.timestamp < b.timestamp ? 1 : -1;
    });
    return items;
  }

  /**
  * Called when items are downloaded via getItemsByProperty with a property/value pair (e.g.
  * retrieve all items with property 'groupId' and value 'groupidhere'. All items are
  * initially downloaded in bulk, after which a listener is set up for subsequent additions,
  * changes and deletions.
  */
  itemsDownloaded(property: string, value: string, onSuccess, snapshot) {
    console.log(this.databaseObject.className + 'Store: itemsDownloaded with value ' + value);
    var timestamp = 0;
    var items = snapshot.val();
    for (var id in items) {
      var item = items[id];
      if (item.status == Status.ARCHIVED) continue;

      if (this.storageMappings[property][value].hasOwnProperty(id)) {
        // Exists locally, item must be updated.
        this.itemChanged(property, item);
      } else {
        this.itemAdded(property, null, null, item);
      }
      timestamp = item.timestamp;
    }

    this.currentlyDownloading[property][value] = false;
    this.addListeners(property, value, timestamp + 1);

    this.emitChange(property, value);

    if (onSuccess) { onSuccess(); }
  }

  /**
  * Very similar to downloadItem except returns a promise that will be called once the item is
  * downloaded.
  */
  ensureItemById(id) {
    var promise = new Promise(function(resolve, reject) {
      var onResolve = function (data) {
        resolve(data)
      };
      var onReject = function (error) {
        reject(error);
      };
      if (!this.storage.hasOwnProperty(id)) {
        this.storage[id] = null;
        this.downloadItem(id, onResolve, onReject);
      } else if (!this.isDownloading[id]){
        console.log('resolving callback because it isn\'t downloading');
        resolve(this.storage[id]);
      } else {
        console.log('Adding callback');
        this.promiseResolveCallbacks.push(onResolve);
      //	reject('Already waiting on the download.');
      }
    }.bind(this));
    return promise;
  }


  downloadItem(id, onSuccess?, onError?) {
    this.isDownloading[id] = true;
    this.resetErrorInfo();
    DataServices.DownloadData(
      this.firebasePath + '/' + id,
      this.itemDownloaded.bind(this, id, onSuccess),
      this.errorOccurred.bind(this, id, onError));
  }

  itemDownloaded(id: string, onSuccess, snapshot) {
    console.log(this.databaseObject.className + 'Store: itemDownloaded with id ' + id);
    this.isDownloading[id] = false;
    if (snapshot && snapshot.val() && !this.storage.hasOwnProperty[id]) {
      this.itemAdded('id', null, null, snapshot.val());
    } else if (snapshot && snapshot.val()) {
      this.itemChanged('id', snapshot.val());
    } else {
      this.itemDeletedWithId(id);
    }
    if (onSuccess) { onSuccess(); }
    this.emitChange('id', id);
    this.resolvePromises(id);
  }

  itemAdded(prop, onSuccess, onError, item) {
    if (item) {
      var casted = this.databaseObject.castObject(item);
      // Wait for the subsequent update to set the id.
      if (!casted.id) return;
      if (prop) {
        console.log(this.databaseObject.className + 'Store: added with prop ' + prop + ' and value ' + casted[prop]);
        this.addIdToMapping(this.storageMappings[prop], casted[prop], casted.id);
      }
      this.storage[casted.id] = casted;

      if (onSuccess) onSuccess();
      this.emitChange(prop, casted[prop]);
    } else {
      if (onError) onError();
    }
  }

  itemDeleted(snapshot) {
    var deletedObject = <DatabaseObject>snapshot.val();
    this.itemDeletedWithId(deletedObject.id);
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

  itemChanged(prop, snapshot) {
    var changedObject = this.databaseObject.castObject(snapshot);
    if (this.storage.hasOwnProperty(changedObject.id)) {
      console.log(this.databaseObject.className + 'Store: itemChanged with id ' + changedObject.id + ' and prop ' + prop);
      this.storage[changedObject.id] = changedObject;
      this.emitChange(prop, changedObject[prop]);
    } else {
      this.itemAdded(prop, null, null, snapshot);
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

  areItemsDownloading(property, value) {
    return this.currentlyDownloading[property][value];
  }

  isItemDownloading(id) {
    return this.isDownloading[id];
  }

  downloadFromMapping(property, value, onSuccess?, onError?) {
    this.resetErrorInfo();
    this.currentlyDownloading[property][value] = true;
    var path = DatabaseObject.GetPathToMapping(
      this.firebasePath,
      property,
      value);

    DataServices.DownloadDataOnce(path,
      this.itemsDownloaded.bind(this, property, value, onSuccess));
  }

  onChildAdded(property, snapshot) {
    this.itemAdded(property, null, null, snapshot.val());
  }

  onChildChanged(property, snapshot) {
    this.itemChanged(property, snapshot.val());
  }

  onChildRemoved(property, value, snapshot) {
    this.itemDeleted(snapshot);
    this.emitChange(property, value);
  }

  addListeners(property, value, timestamp) {
    var path = DatabaseObject.GetPathToMapping(
      this.firebasePath,
      property,
      value);

    DataServices.OnChildAdded(path, this.onChildAdded.bind(this, property), timestamp);
    DataServices.OnChildChanged(path, this.onChildChanged.bind(this, property));
    DataServices.OnChildRemoved(path, this.onChildRemoved.bind(this, property, value));
  }
}

export default BaseStore;
