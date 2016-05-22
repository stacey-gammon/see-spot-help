import * as React from 'react';
var Loader = require('react-loader');

import PhotoUpload from '../shared/photoupload';
import PhotoStore from '../../stores/photostore';

export default class HeadShot extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      src: this.props.src
    };
  }

  componentDidMount() {
    PhotoStore.addPropertyListener(
      this, 'id', this.props.photoId, this.getHeadShotPhotoSrc.bind(this));
    if (!this.props.src) {
      this.getHeadShotPhotoSrc();
    }
  }

  componentWillUnmount() {
    PhotoStore.removePropertyListener(this);
  }

  getHeadShotPhotoSrc() {
    var photo = PhotoStore.getItemById(this.props.photoId);
    if (photo) {
      var src = photo.thumbnailUrl || photo.src;
      this.setState({src: src, loaded: true});
    } else if (!PhotoStore.isItemDownloading(this.props.photoId)) {
      this.setState({loaded: true, src: 'images/no-photo-available.jpg'});
    }
  }

  render() {
    var src = this.props.src || this.state.src;
    var loaded = this.state.loaded || !!src;
    if (!loaded) {
      return <span className="spinner"><i className='fa fa-spinner fa-spin fa-4x'></i></span>
    }
    return (
      <PhotoUpload
        editable={this.props.editable}
        headShot="true"
        group={this.props.group}
        permission={this.props.permission}
        animal={this.props.animal}>
        <Loader loaded={loaded} >
          <img className="media-object head-shot" src={src} />
        </Loader>
      </PhotoUpload>
    );
  }
}
