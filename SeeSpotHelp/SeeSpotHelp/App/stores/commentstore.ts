'use strict';

import Comment from '../core/databaseobjects/comment';
import BaseStore from './basestore';

export default class CommentStore extends BaseStore {
  protected databaseObject: Comment = new Comment();
  constructor() {
    super();
    this.Init();
  }
}
