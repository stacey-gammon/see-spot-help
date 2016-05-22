'use strict'

import * as React from 'react';

import DataServices from '../core/dataservices';
import Photo from '../core/databaseobjects/photo';
import Activity from '../core/databaseobjects/activity';
import LoginStore from '../stores/loginstore';

export default class TakePhotoButton extends React.Component<any, any> {
  public refs: any;
  public context: any;

  // Required for page transitions via this.context.router.push.
  static contextTypes = { router: React.PropTypes.object.isRequired }

  constructor(props) {
    super(props);
  }

  onChange() {
    this.forceUpdate();
  }

  goToAddPhotoPage(file) {
    this.context.router.push(
      {
        pathname: "addPhotoPage",
        state: {
          groupId: this.props.animal.groupId,
          animalId: this.props.animal.id,
          file: file
        }
      });
  }

  loadPhoto() {
    var file = this.refs.addPhotoFileInput.files[0];
    this.goToAddPhotoPage(file);
  }

  addPhoto() {
    this.refs.addPhotoFileInput.click();
  }

  allowAction() {
    return this.props.permission.inGroup();
  }

  render() {
    return (
      <span>
        <button className="btn btn-info"
            disabled={!this.allowAction()}
            onClick={this.addPhoto.bind(this)}
            style={this.props.style}>
          <span className="glyphicon glyphicon-camera"></span>
        </button>
        <input type="file" accept="image/*"
            onChange={this.loadPhoto.bind(this)}
            className="addPhotoFileInput"
            ref="addPhotoFileInput"/>
      </span>
    );
  }
}
