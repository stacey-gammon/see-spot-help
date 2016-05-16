'use strict'

import * as React from 'react';

var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;

import PhotoStore from '../../stores/photostore';
import AnimalStore from '../../stores/animalstore';

import HeadShot from './headshot';

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
export default class AnimalListItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { imageSrc: null }
  }

  componentDidMount() {
    if (this.props.animal) {
      PhotoStore.addPropertyListener(this, 'animalId', this.props.animal.id, this.onChange.bind(this));
    }
  }

  componentWillUnmount() {
    PhotoStore.removePropertyListener(this);
  }

  onChange() {
    this.forceUpdate();
  }

  render() {
    var photos = PhotoStore.getPhotosByAnimalId(this.props.animal.id);
    var imageSrc = photos && photos.length > 0 ? photos[0].src : this.props.animal.getDefaultPhoto();
    return (
      <a href='#' key={this.props.animal.id} className='list-group-item animalListElement'>
        <LinkContainer to={{ pathname: 'animalHomePage' ,
                 state: { user: this.props.user, group: this.props.group, animal: this.props.animal} }}>
          <div className='media'>
            <div className='media-left'>
              <HeadShot src={imageSrc}
                permission={this.props.permission}
                animal={this.props.animal}
                group={this.props.group}/>
            </div>
            <div className='media-body'>
              <div className='media-left animal-thumbnail-info-left'>
                <h4>{this.props.animal.name}</h4>
                <div className='animalThumbnailText'>{this.props.animal.status}</div>
                <div className='animalThumbnailText'>{this.props.animal.breed}</div>
                <div className='animalThumbnailText'>{this.props.animal.age} years old</div>
              </div>
              <div className='media-body'>
                <div className='animal-thumbnail-description'>
                  {this.props.animal.description}
                </div>
              </div>
            </div>
          </div>
        </LinkContainer>
      </a>
    );
  }
}
