'use strict'

import * as React from 'react';
var Link = require('react-router').Link;
var FacebookLogin = require('../facebooklogin');

import InfoBar from '../shared/infobar';

import LoginStore from '../../stores/loginstore';
import Volunteer from '../../core/databaseobjects/volunteer';

export default class BasicSettingsTab extends React.Component<any, any> {
  public refs: any;
  contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      updated: false
    }
  }

  updateSettings() {
    LoginStore.getUser().name = this.refs.name.value;
    LoginStore.getUser().displayName = this.refs.displayName.value;
    LoginStore.getUser().email = this.refs.email.value;
    LoginStore.getUser().update();
    this.props.onChange();
  }

  render() {
    if (!LoginStore.getUser()) return null;
    var displayName = LoginStore.getUser().displayName ?
      LoginStore.getUser().displayName : LoginStore.getUser().name;
    return (
      <div className='page'>
        <InfoBar><h1>Settings</h1></InfoBar>
        <div className='input-group'>
          <span className='input-group-addon'>Email: </span>
          <input type='text'
             ref='email'
             className='form-control'
             defaultValue={LoginStore.getUser().email}/>
        </div>
        <div className='input-group'>
          <span className='input-group-addon'>Name: </span>
          <input type='text'
               ref='name'
               className='form-control'
               defaultValue={LoginStore.getUser().name}/>
        </div>
        <div className='input-group'>
          <span className='input-group-addon'>Display Name: </span>
          <input type='text'
               ref='displayName'
               className='form-control'
               defaultValue={displayName}/>
        </div>
        <p>* Supply a display name if you would like to protect your privacy</p>
        <br/>
        <div style={{textAlign: 'center'}}>
          <button className='btn btn-info' onClick={this.updateSettings}>
            Update
          </button>
        </div>
      </div>
    );
  }
}
