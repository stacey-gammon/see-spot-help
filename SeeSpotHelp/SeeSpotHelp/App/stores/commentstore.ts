'use strict';

import Comment from '../core/databaseobjects/comment';
import BaseStore from './basestore';

class CommentStore extends BaseStore {
  protected databaseObject: Comment = new Comment();
  constructor() {
    super();
    this.Init();
  }
}

export default new CommentStore();
