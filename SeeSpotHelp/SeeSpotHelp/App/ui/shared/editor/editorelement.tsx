'use strict'

import * as React from 'react';

import InputFields from './inputfields';
import AddOrEditButtonBar from './addoreditbuttonbar';
import InfoBar from '../infobar';

import GroupEditor from '../../../core/editor/groupeditor';
import Utils from '../../uiutils';
import Error from '../error';
import Group from '../../../core/databaseobjects/group';
import Permission from '../../../core/databaseobjects/permission';
import InputField from '../../../core/editor/inputfield';
import InputFieldValidation from '../../../core/editor/inputfieldvalidation';

import LoginStore from '../../../stores/loginstore';

export default class EditorElement extends React.Component<any, any> {
  public refs: any;

  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  validateFields() {
    var validated = this.props.editor.validateFields();
    if (!validated) { this.forceUpdate(); }
    return validated;
  }

  onError(errorMessage) {
    this.setState({hasError: true, errorMessage: errorMessage});
  }

  edit() {
    this.refs.inputFields.fillWithValues(this.props.editor.getInputFields());
    if (this.validateFields()) {
      this.props.editor.update(
        this.props.extraFields,
        this.onError.bind(this),
        this.props.onEditOrInsert);
    }
  }

  insert() {
    this.refs.inputFields.fillWithValues(this.props.editor.getInputFields());
    if (this.validateFields()) {
      this.props.editor.insert(
        this.props.extraFields,
        this.onError.bind(this),
        this.props.onEditOrInsert);
    }
  }

  delete() {
    if (confirm('Are you sure you wish to permanently delete?')) {
      this.props.editor.delete(
        this.onError.bind(this),
        this.props.onDelete);
    }
  }

  render() {
    return (
      <div className='page'>
        <InfoBar noTabs='true'><h1>{this.props.title}</h1></InfoBar>
        <Error error={this.state.hasError} message={this.state.errorMessage} />
        <InputFields ref='inputFields' fields={this.props.editor.getInputFields()}/>
        <AddOrEditButtonBar
          mode={this.props.mode}
          permission={this.props.permission}
          onAdd={this.insert.bind(this)}
          onEdit={this.edit.bind(this)}
          onDelete={this.delete.bind(this)}/>
      </div>
    );
  }
}
