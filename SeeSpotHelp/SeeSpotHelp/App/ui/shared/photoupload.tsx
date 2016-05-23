'use strict'

import * as React from 'react';

import DataServices from '../../core/dataservices';
import Photo from '../../core/databaseobjects/photo';
import Activity from '../../core/databaseobjects/activity';
import LoginStore from '../../stores/loginstore';

export default class PhotoUpload extends React.Component<any, any> {
  public refs: any;
  public context: any;

  // Required for page transitions via this.context.router.push.
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
  }

  goToAddPhotoPage(file) {
    this.context.router.push(
      {
        pathname: "addPhotoPage",
        state: {
          groupId: this.props.animal ? this.props.animal.groupId : this.props.groupId,
          headShot: this.props.headShot,
          animalId: this.props.animal ? this.props.animal.id : null,
          file: file
        }
      });
  }

  loadPhoto() {
    var file = this.refs.addPhotoFileInput.files[0];
    this.goToAddPhotoPage(file);
  }

  addPhoto() {
    if (this.props.editable) {
      this.refs.addPhotoFileInput.click();
    }
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
