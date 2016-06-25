import * as React from 'react';

import Promise = require('bluebird');
var Loader = require('react-loader');

import EditorElement from './shared/editor/editorelement';

import PhotoEditor from '../core/editor/photoeditor';
import Photo from '../core/databaseobjects/photo';
import Utils from './uiutils';
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';
import AnimalStore from '../stores/animalstore';
import PhotoStore from '../stores/photostore';
import PermissionsStore from '../stores/permissionsstore';
import StoreStateHelper from '../stores/storestatehelper';

export default class AddPhotoPage extends React.Component<any, any> {
  public refs: any;
  public context: any;

  constructor(props) {
    super(props);

    var mode = Utils.FindPassedInProperty(this, 'mode');
    var animalId = Utils.FindPassedInProperty(this, 'animalId');
    var groupId = Utils.FindPassedInProperty(this, 'groupId');
    var file = Utils.FindPassedInProperty(this, 'file');
    var headShot = Utils.FindPassedInProperty(this, 'headShot');

    if (!mode) mode = 'add';

    this.state = {
      animalId: animalId,
      mode: mode,
      groupId: groupId,
      file: file,
      headShot: headShot,
      loaded: false
    };
    this.uploadFile(file);
  }

  // Required for page transitions via this.context.router.push.
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  ensureRequiredState() {
    var promises = [];
    promises.push(this.uploadFile(this.state.file));
    if (this.state.groupId) {
      promises.push(GroupStore.ensureItemById(this.state.groupId));
    }
    if (this.state.animalId) {
      promises.push(AnimalStore.ensureItemById(this.state.animalId));
    }

    Promise.all(promises).then(
      function (results) {
        var group = GroupStore.getGroupById(this.state.groupId);
        var animal = AnimalStore.getItemById(this.state.animalId);
        var permission = StoreStateHelper.GetPermission(this.state);
        var photo = results[0];
        var editor = new PhotoEditor(photo);
        this.setState({
          permission: permission,
          editor: editor,
          photo: photo,
          loaded: true
        });
        this.addChangeListeners(group);
      }.bind(this)
    );
  }

  addChangeListeners() {
    LoginStore.addChangeListener(this.onChange.bind(this));
    if (LoginStore.getUser()) {
      PermissionsStore.addPropertyListener(
        this, 'userId', LoginStore.getUser().id, this.onChange.bind(this));
    }
  }

  componentWillMount() {
    this.ensureRequiredState();
  }

  uploadFile(file) {
    let me = this;
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          var filePayload = e.target.result;
          // Generate a location that can't be guessed using the file's contents and a random number
          var hash = CryptoJS.SHA256(Math.random() + '' + CryptoJS.SHA256(filePayload));
          var photo = new Photo();
          photo.src = filePayload;
          photo.file = file;
          photo.animalId = me.state.animalId;
          photo.groupId = me.state.groupId;
          photo.userId = LoginStore.getUser().id;
          resolve(photo);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }

  componentWillUnmount() {
    GroupStore.removeChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.forceUpdate();
  }

  goBackToPage() {
    this.context.router.goBack();
  }

  render() {
    var extraFields = {
      animalId: this.state.animalId,
      groupId: this.state.groupId,
      headShot: this.state.headShot,
      src: this.state.src,
      userId: LoginStore.getUser() ? LoginStore.getUser().id : null
    }

    var title = this.state.mode == 'add' ?
      'Add a photo' : 'Edit your photo';
    return (
      <Loader loaded={this.state.loaded}>
        <EditorElement
          title={title}
          extraFields={extraFields}
          mode={this.state.mode}
          permission={this.state.permission}
          onEditOrInsert={this.goBackToPage.bind(this)}
          onDelete={this.goBackToPage.bind(this)}
          editor={this.state.editor} />
      </Loader>
    );
  }
}
