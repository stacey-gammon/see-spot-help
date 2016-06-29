import * as React from 'react';

var Loader = require('react-loader');

import Comment from '../../../core/databaseobjects/comment';
import CommentStore from '../../../stores/commentstore';

export default class Comments extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      comments: CommentStore.getItemsByProperty('activityId', this.props.activityId)
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    CommentStore.addPropertyListener(this, 'acitivtyId', this.props.activityId, this.onChange);
  }

  componentWillUnmount() {
    CommentStore.removePropertyListener(this);
  }

  onChange() {
    this.setState(
      {
        comments: CommentStore.getItemsByProperty('activityId', this.props.acitivtyId),
        loading: CommentStore.areItemsDownloading()
      });
  }

  createCommentElement(comment: Comment) {
    return (
      <div>
        {comment.comment}
      </div>
    );
  }

  render() {
    let commentElements = [];
    if (this.state.comments) {
      commentElements = this.state.comments.map(this.createCommentElement.bind(this));
    }
    return (
      <div>
        {this.getAddCommentBar()}
        <Loader loaded={this.state.loaded}>
          {commentElements}
        </Loader>
      </div>
    );
  }
}
