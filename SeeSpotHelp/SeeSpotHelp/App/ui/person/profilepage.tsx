'use strict';

import * as React from 'react';

var FacebookLogin = require('../facebooklogin');
var GroupInfoBox = require('../group/groupinfobox');
var SearchPage = require('../searchpage');
var LoginPage = require('../loginpage');

import ProfilePageTabs from './profilepagetabs';
import InfoBar from '../shared/infobar';

import Utils from '../uiutils';
import Volunteer from '../../core/databaseobjects/volunteer';
import Group from '../../core/databaseobjects/group';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import LoginStore from '../../stores/loginstore';

export default class ProfilePage extends React.Component<any, any> {
  context = { router: null };

  constructor(props) {
    super(props);
    this.state = {
      imgUrl: null
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    // There is no user and none is going to be downloaded, we must prompt them to log in.
    // TODO: when we open the app up to the public, we must be able to handle non-logged in
    // users.
    if (!LoginStore.getUser() && !LoginStore.userDownloading) {
      console.log('profilepage: pushing to private beta');
      this.context.router.push('/loginpage');
    }
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
    this.loadFacebookPhoto();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    if (!LoginStore.getUser() && !LoginStore.userDownloading) {
      this.context.router.push('/loginpage');
    }
    this.forceUpdate();
  }

  loadFacebookPhoto() {
    if (!LoginStore.fbLoaded) return;
    FB.api(
       '/' + LoginStore.getUser().id.substring(9) + '/picture?width=75&height=75',
       function (response) {
         if (response && !response.error) {
           LoginStore.getUser().imgUrl = response.data.url;
           this.setState({imgUrl: response.data.url});
         }
       }.bind(this)
   );
  }

  render() {
    if (!LoginStore.getUser()) return null;
    var heading = 'Hello, ' + LoginStore.getUser().name;
    return (
      <div className='page'>
        <InfoBar>
          <img src={this.state.imgUrl} className='head-shot'/>
          <h1 style={{textAlign: 'left !important'}}>{heading}</h1>
        </InfoBar>
        <ProfilePageTabs user={LoginStore.getUser()}/>
      </div>
    );
  }
}
