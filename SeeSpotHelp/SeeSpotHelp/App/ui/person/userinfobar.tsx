'use strict';

import * as React from 'react';

import InfoBar from '../shared/infobar';
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

  loadFacebookPhoto() {
    if (!LoginStore.fbLoaded) return;
    FB.api(
       '/' + LoginStore.getUser().id.substring(9) + '/picture?width=75&height=75',
       function (response) {
         if (response && !response.error) {
           this.props.user.imgUrl = response.data.url;
           this.setState({profileUrl: response.data.url});
         }
       }.bind(this)
   );
  }

  getProfileImage() {
    if (this.state.profileUrl) {
      return this.state.profileUrl;
    } else {
      this.loadFacebookPhoto();
      return null;
    }
  }

  render() {
    return (
      <div>
        <InfoBar className='group-info-bar' title={this.getTitle()}>
          <img src={this.getProfileImage()} className='head-shot'/>
          {this.getHeader()}
        </InfoBar>
      </div>
    );
  }
}
