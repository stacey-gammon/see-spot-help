'use strict';

import * as React from 'react';

import InfoBar from '../shared/infobar';
import ProfilePic from './profilepic';
import LoginStore from '../../stores/loginstore';

export default class UserInfoBar extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      profileUrl: this.props.user.imgUrl
    }
  }

  getHeader() {
    var style = {textAlign: 'left !important'};
    if (this.props.user == LoginStore.getUser()) {
      return <h1 style={style}>{'Hello, ' + LoginStore.getUser().name} </h1>;
    } else {
      return <h2 style={style}>{this.props.user.getDisplayName()}</h2>;
    }
  }

  getTitle() {
    if (this.props.user == LoginStore.getUser() || !this.props.group) {
      return null;
    } else {
      return this.props.group.name;
    }
  }

  render() {
    return (
      <div>
        <InfoBar className='group-info-bar' title={this.getTitle()}>
          <ProfilePic user={this.props.user}/>
          {this.getHeader()}
        </InfoBar>
      </div>
    );
  }
}
