'use strict';

import * as React from 'react';

var FacebookLogin = require('../facebooklogin');
var GroupInfoBox = require('../group/groupinfobox');
var SearchPage = require('../searchpage');
var LoginPage = require('../loginpage');

import ProfilePageTabs from './profilepagetabs';

import Utils from '../../core/utils';
import Volunteer from '../../core/databaseobjects/volunteer';
import VolunteerGroup from '../../core/databaseobjects/volunteergroup';
import GroupStore from '../../stores/groupstore';
import VolunteerStore from '../../stores/volunteerstore';
import LoginStore from '../../stores/loginstore';

export default class ProfilePage extends React.Component<any, any> {
	context = { router: null };

	constructor(props) {
		super(props);
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
			this.context.router.push('/privatebetapage');
		}
	}

	componentDidMount() {
		LoginStore.addChangeListener(this.onChange);
	}

	componentWillUnmount() {
		LoginStore.removeChangeListener(this.onChange);
	}

	onChange() {
		if (!LoginStore.getUser() && !LoginStore.userDownloading) {
			this.context.router.push('/privatebetapage');
		}
		this.forceUpdate();
	}

	render() {
		if (!LoginStore.getUser()) return null;
		var heading = 'Hello, ' + LoginStore.getUser().name;
		return (
			<div className='page'>
				<div className='media info-top'>
					<div className='media-body'>
						<h1>{heading}</h1>
					</div>
				</div>
				<ProfilePageTabs user={LoginStore.getUser()}/>
			</div>
		);
	}
}
