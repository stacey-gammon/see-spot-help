'use strict'

import * as React from 'react';

var Loader = require('react-loader');
var ReactBootstrap = require('react-bootstrap');
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var DropdownMenu = ReactBootstrap.DropdownMenu;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var Button = ReactBootstrap.Button;
var MenuItem = ReactBootstrap.MenuItem;

import ErrorPopup from '../errorpopup';
import CommentStore from '../../../stores/commentstore';
import VolunteerStore from '../../../stores/volunteerstore';
import Comment from '../../../core/databaseobjects/comment';
import LoginStore from '../../../stores/loginstore';

export default class Comments extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      comments: [],
      editCommentId: null
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    CommentStore.addPropertyListener(this, 'activityId', this.props.activityId, this.onChange);
    this.onChange();
  }

  componentWillUnmount() {
    CommentStore.removePropertyListener(this);
  }

  onChange() {
    this.setState(
      {
        comments: CommentStore.getItemsByProperty('activityId', this.props.activityId),
        loaded: !CommentStore.areItemsDownloading('activityId', this.props.activityId)
      });
  }

  editAction(commentId) {
    this.setState({editCommentId: commentId});
  }

  getEditMenuItem(comment) {
    if (comment.userId == LoginStore.getUser().id) {
      return <MenuItem eventKey="1" onClick={this.editAction.bind(this, comment.id)}>Edit</MenuItem>
    } else {
      return null;
    }
  }

  deleteAction(comment) {
    let me = this;
    comment.delete().then(function() {
      me.setState({error: false, errorMessage: ''});
    }, function (error) {
      me.setState({error: true, errorMessage: error.message});
    });
  }

  getActionDropDown(comment) {
    return (
      <div className='dropdown activity-dropdown' id='actionDropDown'>
        <DropdownButton title={<span className="glyphicon glyphicon-edit edit-action-btn"></span>}
                        className='action-dropdown-btn'>
          {this.getEditMenuItem(comment)}
          <MenuItem eventKey="2" onClick={this.deleteAction.bind(this, comment)}>Delete</MenuItem>
        </DropdownButton>
      </div>
    );
  }

  getActions(comment) {
    if (!LoginStore.getUser()) return null;
    if (comment.userId == LoginStore.getUser().id || this.props.permission.admin()) {
      return (
        <div className="comment-actions">
          {this.getActionDropDown(comment)}
        </div>
      );
    } else {
      return null;
    }
  }

  updateComment(comment, e) {
    comment.comment = this.refs['editComment'].value;
    let me = this;
    comment.update().then(function() {
      me.setState({editCommentId: null, error: false});
    }, function (error) {
      me.setState({error: true, errorMessage: error.message});
    });
    e.preventDefault();
    return false;
  }

  createCommentElement(comment: Comment) {
    VolunteerStore.addPropertyListener(this, 'userId', comment.userId, this.onChange);
    let member = VolunteerStore.getVolunteerById(comment.userId);
    if (member) {
      if (this.state.editCommentId == comment.id) {
        return (
          <form onSubmit={this.updateComment.bind(this, comment)}>
            <input type='text'
                   className='add-comment-input'
                   ref='editComment'
                   defaultValue={comment.comment}/>
          </form>
        );
      } else {
        return (
          <div className='comment'>
            {comment.comment}
            <p className='member-comment-info'>
            <a><LinkContainer
            to={{ pathname: "/memberPage",
              state: {
                userId: comment.userId,
                groupId: comment.groupId
              } }}>
            <button className="invisible-button">{member.name}</button>
            </LinkContainer>
            </a>
            {comment.getDateForDisplay()}
            </p>
            {this.getActions(comment)}
          </div>
        );
      }
    }
  }

  insertComment(e) {
    let comment = new Comment();
    comment.comment = this.refs['newComment'].value;
    comment.userId = LoginStore.getUser().id;
    comment.activityId = this.props.activityId;
    comment.groupId = this.props.groupId;
    let me = this;
    comment.insert().then(function() {
      me.refs['newComment'].value = '';
      me.setState({error: false, errorMessage: ''});
    }, function (error) {
      me.setState({error: true, errorMessage: error.message});
    });
    e.preventDefault();
    return false;
  }

  addCommentBar() {
    if (this.props.permission.inGroup()) {
      return (
        <form onSubmit={this.insertComment.bind(this)}>
          <ErrorPopup error={this.state.error} errorMessage={this.state.errorMessage}/>
          <input type='text'
                 className='add-comment-input'
                 ref='newComment'
                 placeholder='add comment...'/>
        </form>
      );
    } else {
      return null;
    }
  }

  render() {
    let commentElements = [];
    if (this.state.comments) {
      commentElements = this.state.comments.map(this.createCommentElement.bind(this));
    }
    return (
      <div>
        {this.addCommentBar()}
        <Loader loaded={this.state.loaded}>
          {commentElements}
        </Loader>
      </div>
    );
  }
}
