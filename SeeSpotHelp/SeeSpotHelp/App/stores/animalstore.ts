'use strict';

import Animal from "../core/databaseobjects/animal";
import BaseStore from './basestore';
import { Status } from "../core/databaseobjects/databaseobject";

class AnimalStore extends BaseStore {
  protected databaseObject: Animal = new Animal();

  constructor() {
    super();
    this.Init();
  }

  getAnimalById(id) {
    return this.getItemById(id);
  }

  getAnimalsByUser(userId) {
    let animals = this.getItemsByProperty('userId', userId);
    return animals.filter(function(animal) { return animal.status != Status.ARCHIVED; });
  }

  getAnimalsByGroupId(groupId) {
    let animals = this.getItemsByProperty('groupId', groupId);
    return animals.filter(function(animal) { return animal.status != Status.ARCHIVED; });
  }
}

export default new AnimalStore();
