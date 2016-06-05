'use strict'

import * as React from 'react';

import Animal from '../../core/databaseobjects/animal';
import Group from '../../core/databaseobjects/group';
import Permission from '../../core/databaseobjects/permission';
import PhotoStore from '../../stores/photostore';
import LoginStore from '../../stores/loginstore';
import PermissionsStore from '../../stores/permissionsstore';

import InfoBar from '../shared/infobar';
import AnimalHeadShot from './animalheadshot';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

// Animal home page displays animal information, photos and activies and notes made
// by volunteers, as well as ability to edit, delete and add a new activity or note
// about the specific animal.
export default class AnimalInfoBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  shouldAllowUserToEdit() {
    return this.props.permission.inGroup();
  }

  getEditIcon() {
    if (!this.shouldAllowUserToEdit()) return null;
    return (
      <LinkContainer
        to={{ pathname: "addAnimalPage",
          state: { groupId: this.props.group.id,
              animal: this.props.animal,
              mode: 'edit' } }}>
        <span style={{marginLeft: '10px'}}
            className="glyphicon glyphicon-edit">
        </span>
      </LinkContainer>
    );
  }

  getHeadShotPhotoSrc() {
    var photo = null;
    if (this.props.animal.photoId) {
      photo = PhotoStore.getItemById(this.props.animal.photoId);
    } else {
      var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
      photo = photos.length > 0 ? photos[0] : null;
    }
    return photo ? photo.src : this.props.animal.getDefaultPhoto();
  }

  getAgeDisplay() {
    if (!this.props.animal.age) return null;
    return <p className="animalInfo">Age: {this.props.animal.age}</p>
  }

  render() {
    var imageSrc = this.getHeadShotPhotoSrc();
    var animal = this.props.animal;
    return (
      <InfoBar className='animal-info-bar' title={this.props.group.name}>
          <AnimalHeadShot
            permission={this.props.permission}
            animal={animal}
            group={this.props.group}/>
          <div className='media'>
            <div className='media-left'>
              <h1 className="animalInfo">{animal.name}
              {this.getEditIcon()}
              </h1>
              {this.getAgeDisplay()}
              <p className="animalInfo">{animal.status}</p>
              <p className="animalInfo">{animal.breed}</p>
            </div>
            <div className='media-body'>
              <p className="animalInfo">{animal.description}</p>
            </div>
          </div>
          <div/>
        </InfoBar>
    );
  }
}
