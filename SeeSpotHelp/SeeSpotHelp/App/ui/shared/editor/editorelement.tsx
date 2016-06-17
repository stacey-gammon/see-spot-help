'use strict'

import * as React from 'react';
var Loader = require('react-loader');

import InputFields from './inputfields';
import AddOrEditButtonBar from './addoreditbuttonbar';
import InfoBar from '../infobar';

import GroupEditor from '../../../core/editor/groupeditor';
import Utils from '../../uiutils';
import Error from '../error';
import Group from '../../../core/databaseobjects/group';
import Permission from '../../../core/databaseobjects/permission';
import InputField from '../../../core/editor/inputfields/inputfield';
import InputFieldValidation from '../../../core/editor/inputfieldvalidation';

import LoginStore from '../../../stores/loginstore';

export default class EditorElement extends React.Component<any, any> {
  public refs: any;

  constructor(props) {
    super(props);
    this.state = {hasError: false, loaded: true};
  }

  validateFields() {
    var validated = this.props.editor.validateFields();
    if (!validated) {
      this.setState({errorMessage: this.props.editor.errorMessage });
    }
    return validated;
  }

  onError(error) {
    this.setState({errorMessage: error.message, hasError: true, loaded: true});
  }

  edit() {
    this.refs.inputFields.fillWithValues(this.props.editor.getInputFields());
    if (this.validateFields()) {
      this.setState({loaded: false});
      this.props.editor.update(this.props.extraFields).then(
        this.props.onEditOrInsert.bind(this),
        this.onError.bind(this));
    } else if (this.props.editor.errorMessage) {
      this.onError({ message: this.props.editor.errorMessage});
    }
  }

  insert() {
    this.refs.inputFields.fillWithValues(this.props.editor.getInputFields());
    if (this.validateFields()) {
      this.setState({loaded: false});
      this.props.editor.insert(this.props.extraFields).then(
        this.props.onEditOrInsert.bind(this),
        this.onError.bind(this));
    } else if (this.props.editor.errorMessage) {
      this.onError({ message: this.props.editor.errorMessage});
    }
  }

  delete() {
    if (confirm('Are you sure you wish to permanently delete?')) {
      this.props.editor.delete().then(
        this.props.onDelete.bind(this),
        this.onError.bind(this));
    }
  }

  render() {
    return (
      <div className='page'>
        <InfoBar noTabs='true'><h1>{this.props.title}</h1></InfoBar>
        <Error error={this.state.hasError} errorMessage={this.state.errorMessage} />
        <Loader loaded={this.state.loaded}>
          <InputFields ref='inputFields' fields={this.props.editor.getInputFields()}/>
          <AddOrEditButtonBar
            mode={this.props.mode}
            permission={this.props.permission}
            onAdd={this.insert.bind(this)}
            onEdit={this.edit.bind(this)}
            onDelete={this.delete.bind(this)}/>
          </Loader>
      </div>
    );
  }
}
