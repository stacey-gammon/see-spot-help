'use strict'

import * as React from 'react';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import Volunteer from '../../../core/databaseobjects/volunteer';
import ConstStrings from '../../../core/conststrings';
import LoginStore from '../../../stores/loginstore';
import VolunteerStore from '../../../stores/volunteerstore';
import PhotoStore from '../../../stores/photostore';
import PermissionsStore from '../../../stores/permissionsstore';
import AnimalActivityStore from '../../../stores/activitystore';
import Activity from '../../../core/databaseobjects/activity';
import Permission from '../../../core/databaseobjects/permission';
import LightboxImage from '../lightboximage';

export default class ActivityBody extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.activity.photoId) {
      PhotoStore.addPropertyListener(
        this, 'id', this.props.activity.photoId, this.forceUpdate.bind(this));
    }
  }

  componentWillUnmount() {
    PhotoStore.removePropertyListener(this);
  }

  getEditActionButton() {
    if (!this.props.activity.editable() || !LoginStore.getUser() ||
      this.props.activity.userId != LoginStore.getUser().id) {
      return null;
    }
    return (
      <LinkContainer
        to={{ pathname: "addAnimalNote",
          state: { animalId: this.props.activity.animalId,
              activityId: this.props.activity.id,
              groupId: this.props.activity.groupId,
              mode: 'edit' } }}>
        <span style={{marginLeft: '10px'}} className="glyphicon glyphicon-edit">
        </span>
      </LinkContainer>
    );
  }

  getActivityBody() {
    if (this.props.activity.photoId) {
      var photo = PhotoStore.getItemById(this.props.activity.photoId);
      if (!photo) {
        return <span className="spinner"><i className='fa fa-spinner fa-spin'></i></span>
      }
      var src = photo.midSizeUrl || photo.src;
      return (
        <LightboxImage
          photoId={this.props.activity.photoId}
          height='200px'
          src={src}
          view={this.props.view}
          animalId={this.props.activity.animalId}
          groupId={this.props.activity.groupId}
          userId={this.props.activity.userId}/>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <p>{this.props.activity.description}</p>
        {this.getActivityBody()}
      </div>
    );
  }
}
