'use strict';

import Photo from '../core/photo';
import BaseStore from './basestore';

class PhotoStore extends BaseStore {
	protected databaseObject: Photo = new Photo();
	constructor() {
		super();
	}

	getPhotosByAnimalId(animalId) {
		return this.getItemsByProperty('animalId', animalId);
	}

	// Note this will only return the main photo for each animal in the group, used for the
	// animal list view.
	getPhotosByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}
}

export default new PhotoStore();