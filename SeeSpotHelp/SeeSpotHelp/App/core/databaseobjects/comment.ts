'use strict';

var dateFormat = require('dateformat');

import DataServices from '../dataservices';
import DatabaseObject from './databaseobject';

export default class Comment extends DatabaseObject {
  public comment: string = '';
  public userId: string;
  public activityId: string;
  public groupId: string;
  public photoId: string = null;

  constructor() {
    super();
    this.mappingProperties.push('userId');
    this.mappingProperties.push('activityId');
    this.mappingProperties.push('photoId');
    this.mappingProperties.push('groupId');
  }

  createInstance() { return new Comment(); }

  getDateForDisplay() {
    return dateFormat(new Date(this.timestamp), "mm/dd/yy, h:MM TT");
  }

  editable() { return true; }
}
