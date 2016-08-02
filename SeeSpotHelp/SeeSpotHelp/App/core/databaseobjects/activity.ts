'use strict';

import DataServices from '../dataservices';
import DatabaseObject from './databaseobject';
import Comment from './comment';

export default class Activity extends DatabaseObject {
  public description: string = '';
  public userId: string;
  public animalId: string;
  public groupId: string;
  public photoId: string = null;
  public eventId: string = null;
  public linkedChildren: Array<DatabaseObject> = [new Comment()];

  constructor() {
    super();
    this.mappingProperties.push('userId');
    this.mappingProperties.push('groupId');
    this.mappingProperties.push('animalId');
  }

  public static CreatePhotoActivity(photo) {
    var activity = new Activity();
    activity.photoId = photo.id;
    activity.groupId = photo.groupId;
    activity.animalId = photo.animalId;
    activity.userId = photo.userId;
    activity.description = photo.comment;
    return activity;
  }

  createInstance() { return new Activity(); }

  editable() { return true; }
}
