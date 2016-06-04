'use strict'

import * as React from 'react';

import Group from '../../core/databaseobjects/group';
import ConstStrings from '../../core/conststrings';
import DataServices from '../../core/dataservices';
import Permission from '../../core/databaseobjects/permission';
import LoginStore from '../../stores/loginstore';

import ErrorPopup from '../shared/errorpopup';

export default class JoinGroupButton extends React.Component<any, any> {
  public refs: any;
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  requestToJoin() {
    if (!this.props.group || !LoginStore.getUser()|| !this.props.permission) {
      return null;
    }

    var permission = this.props.permission;
    if (permission.pending()) {
      permission.permission = Group.PermissionsEnum.NONMEMBER;
      permission.update().then(this.onSuccess.bind(this), this.onError.bind(this));
      this.refs.requestToJoinButton.innerHTML = ConstStrings.RequestToJoin;
    } else {
      permission.permission = Group.PermissionsEnum.PENDINGMEMBERSHIP;
      permission.update().then(this.onSuccess.bind(this), this.onError.bind(this));
      DataServices.PushFirebaseData('emails/tasks',
        {
          eventType: 'NEW_REQUEST_PENDING',
          adminId: LoginStore.getUser().id,
          groupName: this.props.group.name
        }).then(this.onSuccess.bind(this), this.onError.bind(this));
      this.refs.requestToJoinButton.innerHTML = ConstStrings.JoinRequestPending;
    }
  }
  onSuccess() {
    this.setState({error: false, errorMessage: null});
  }
  onError(error) {
    this.setState({error: true, errorMessage: error.message});
  }

  render() {
    if (!LoginStore.getUser()) return null;

    if (this.props.permission.inGroup()) {
      return null;
    }

    var text = this.props.permission.pending() ?
      ConstStrings.JoinRequestPending : ConstStrings.RequestToJoin;
    var helperText = this.props.permission.pending() ? 'click to cancel' : '';
    return (
      <div>
        <ErrorPopup error={this.state.error} errorMessage={this.state.errorMessage}/>
        <button className="btn btn-warning requestToJoinButton buttonPadding"
            ref="requestToJoinButton"
            onClick={this.requestToJoin.bind(this)}>
          {text}
        </button>
      </div>
    );
  }
}
