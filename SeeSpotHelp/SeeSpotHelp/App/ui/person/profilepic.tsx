'use strict';

import * as React from 'react';

import LoginStore from '../../stores/loginstore';

export default class ProfilePic extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      profileUrl: this.props.user.imgUrl
    }
  }

  loadFacebookPhoto() {
    if (!LoginStore.fbLoaded) return;
    FB.api(
       '/' + this.props.user.id.substring(9) + '/picture?width=75&height=75',
       'get',
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
    return <img src={this.getProfileImage()} className='head-shot'/>
  }
}
