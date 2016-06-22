'use strict';

import * as React from 'react';

var GroupInfoBox = require('../group/groupinfobox');
var SearchPage = require('../searchpage');
import LoginPage from '../loginpage';

import ProfilePageTabs from './profilepagetabs';
import UserInfoBar from './userinfobar';

import Utils from '../uiutils';
import Volunteer from '../../core/databaseobjects/volunteer';
import Group from '../../core/databaseobjects/group';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import LoginStore from '../../stores/loginstore';

export default class ProfilePage extends React.Component<any, any> {
  context = { router: null };
  private mounted: boolean = false;
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
    LoginStore.addChangeListener(this.onChange.bind(this));
    this.mounted = true;
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange.bind(this));
    this.mounted = false;
  }

  onChange() {
    if (!this.mounted) return;
    if (!LoginStore.getUser() && !LoginStore.userDownloading) {
      this.context.router.push('/loginpage');
    }
    this.forceUpdate();
  }

  render() {
    if (!LoginStore.getUser()) return null;
    var heading = 'Hello, ' + LoginStore.getUser().name;
    return (
      <div className='page'>
        <UserInfoBar user={LoginStore.getUser()} />
        <ProfilePageTabs user={LoginStore.getUser()}/>
      </div>
    );
  }
}
