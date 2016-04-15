'use strict';

import Photo from '../core/photo';
import BaseStore from './basestore';

class PhotoStore extends BaseStore {
	protected databaseObject: Photo = new Photo();
	constructor() {
		super();
		this.Init();
	}

	getPhotosByAnimalId(animalId) {
		return this.getItemsByProperty('animalId', animalId).sort(function (a, b) {
			return b.timestamp - a.timestamp;
		});
	}

	// Note this will only return the main photo for each animal in the group, used for the
	// animal list view.
	getPhotosByGroupId(groupId) {
		return this.getItemsByProperty('groupId', groupId);
	}
}

export default new PhotoStore();
