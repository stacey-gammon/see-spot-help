import * as React from 'react';

import PhotoStore from '../../stores/photostore';
import HeadShot from '../shared/headshot';

export default class AnimalHeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PhotoStore.addPropertyListener(
      this, 'animalId', this.props.animal.id, this.forceUpdate.bind(this));
    PhotoStore.addPropertyListener(
      this, 'id', this.props.animal.photoId, this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    PhotoStore.removePropertyListener(this);
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

  render() {
    return (
      <HeadShot src={this.getHeadShotPhotoSrc()}
                photoId={this.props.animal.photoId}
                permission={this.props.permission}
                animal={this.props.animal}
                group={this.props.group}/>
    );
  }
}
