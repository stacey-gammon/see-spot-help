'use strict'

import * as React from 'react';

import DataServices from '../../core/dataservices';
import Photo from '../../core/databaseobjects/photo';
import Activity from '../../core/databaseobjects/activity';
import LoginStore from '../../stores/loginstore';

export default class TakePhotoButton extends React.Component<any, any> {
  public refs: any;
  public context: any;

  // Required for page transitions via this.context.router.push.
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
    this.state = {
      user: LoginStore.getUser()
    }
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.forceUpdate();
  }

  uploadFile(file) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        var filePayload = e.target.result;
        // Generate a location that can't be guessed using the file's contents and a random number
        var hash = CryptoJS.SHA256(Math.random() + '' + CryptoJS.SHA256(filePayload));
        var photo = new Photo();
        photo.src = filePayload;
        photo.file = file;
        photo.animalId = this.props.animal.id;
        photo.groupId = this.props.animal.groupId;
        photo.userId = LoginStore.getUser().id;
        this.goToAddPhotoPage(photo);
      }.bind(this);
    }.bind(this))(file);
    reader.readAsDataURL(file);
  }


  goToAddPhotoPage(photo) {
    this.context.router.push(
      {
        pathname: "addPhotoPage",
        state: {
          groupId: this.props.animal.groupId,
          headShot: this.props.headShot,
          animalId: this.props.animal.id,
          photo: photo
        }
      });
  }

  loadPhoto() {
    var file = this.refs.addPhotoFileInput.files[0];
    this.uploadFile(file);
  }

  addPhoto() {
    this.refs.addPhotoFileInput.click();
  }

  allowAction() {
    return this.props.permission.inGroup();
  }

  render() {
    return (
      <span onClick={this.addPhoto.bind(this)} className='photo-upload'>
        {this.props.children}
        <input type="file" accept="image/*"
            onChange={this.loadPhoto.bind(this)}
            className="addPhotoFileInput"
            ref="addPhotoFileInput"/>
      </span>
    );
  }
}
