import * as React from 'react';
var Lightbox = require('react-image-lightbox');
var Loader = require('react-loader');

import PhotoStore from '../../stores/photostore';

export default class LightboxImage extends React.Component<any, any> {
  public context: any;

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
        index: 0,
        isOpen: false,
        images: null
    };
  }

  componentDidMount() {
    this.loadImages();
  }

  openLightbox() {
      this.setState({ isOpen: true, index: this.getDefaultIndex(this.state.images) });
  }

  closeLightbox() {
      this.setState({ isOpen: false, index: 0 });
  }

  moveNext() {
      this.setState({ index: (this.state.index + 1) % this.state.images.length });
  }

  movePrev() {
      this.setState({
        index: (this.state.index + this.state.images.length - 1) % this.state.images.length
      });
  }

  getMainSrc() {
    return this.state.images ? this.state.images[this.state.index].fullSizeUrl : '';
  }

  loadAnimalImages() {
    let images = PhotoStore.getPhotosByAnimalId(this.props.animalId);
    let index = this.getDefaultIndex(images);
    this.setState({images: images, index: index});
  }

  getDefaultIndex(images) {
    for (let i = 0; i < images.length; i++) {
      if (images[i].id == this.props.photoId) {
        return i;
      }
    }
  }

  loadImagesInGroup() {
    let images = PhotoStore.getPhotosByGroupId(this.props.groupId);
    let index = this.getDefaultIndex(images);
    this.setState({images: images, index: index});
  }

  loadImagesByUser() {
    var images = PhotoStore.getItemsByProperty('userId', this.props.userId).filter(
      // Filter out user's profile photos.
      function(photo) {
        return photo.animalId;
    });
    let index = this.getDefaultIndex(images);
    this.setState({images: images, index: index});
  }

  loadImages() {
    if (this.props.view == 'animal') {
      PhotoStore.addPropertyListener(
          this, 'animalId', this.props.animalId, this.loadAnimalImages.bind(this));
      this.loadAnimalImages();
    } else if (this.props.view == 'group') {
      PhotoStore.addPropertyListener(
          this, 'groupId', this.props.groupId, this.loadImagesInGroup.bind(this));
      this.loadImagesInGroup();
    } else {
      PhotoStore.addPropertyListener(
          this, 'userId', this.props.userId, this.loadImagesByUser.bind(this));
      this.loadImagesByUser();
    }
  }

  getNextSrc() {
    if (!this.state.images) {
      this.loadImages();
    } else {
      return this.state.images[(this.state.index + 1) % this.state.images.length].fullSizeUrl;
    }
  }

  getPrevSrc() {
    return this.state.images[
      (this.state.index + this.state.images.length - 1) % this.state.images.length].fullSizeUrl;
  }

  getLightbox() {
    if (this.state.isOpen) {
        return (
            <Lightbox
                mainSrc={this.getMainSrc()}
                nextSrc={this.getNextSrc()}
                prevSrc={this.getPrevSrc()}

                onCloseRequest={this.closeLightbox.bind(this)}
                onMovePrevRequest={this.movePrev.bind(this)}
                onMoveNextRequest={this.moveNext.bind(this)}
            />
        );
    } else {
      return null;
    }
  }

  render() {
      return (
        <div>
          <Loader loaded={!!this.state.images}>
            <img className='lightbox-image'
                 onClick={this.openLightbox.bind(this)}
                 src={this.props.src}
                 height={this.props.height}/>
            {this.getLightbox()}
          </Loader>
        </div>
      );
  }
}
