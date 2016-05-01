"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var LoginActions = require("../actions/loginactions");

import Volunteer from '../core/databaseobjects/volunteer';
import Group from '../core/databaseobjects/group';
import DatabaseObject from '../core/databaseobjects/databaseobject';
import DataServices from '../core/dataservices';
import BaseStore from './basestore';

enum ChangeEventEnum {
	ANY,
	LOGGED_IN
};

class LoginStore extends BaseStore {
	protected databaseObject: DatabaseObject = new Volunteer('', '');
	private userInBeta: boolean = false;
	private user: Volunteer = null;
	private authenticated: boolean = null;
	private dispatchToken;
	public userDownloading: boolean = false;
	public hasUser: boolean = null;

	private resolveMe = null;
	private rejectMe = null;

	constructor() {
		super();
		this.Init();
		this.dispatchToken = Dispatcher.register(function (action) {
			this.handleAction(action);
		}.bind(this));

		//new Firebase(DataServices.FirebaseURL).onAuth(this.authDataChanged);

		this.checkAuthenticated();
		if (this.isAuthenticating()) {
			this.checkAuthenticatedWithRetries(0);
		}
	}

	isAuthenticating() {
		return sessionStorage.getItem('loginStoreAuthenticating');
	}

	authDataChanged(authData) {
		if (!this) return;
		console.log('LoginStore.authDataChanged');
		if (authData) {
			sessionStorage.setItem('loginStoreAuthenticating', '');
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			// Load the new user associated with the login.
			new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
				"users/" + authData.uid, true);
		} else if (!this.isAuthenticating()) {
			// Authdata may be null while we are trying to authenticate due to a race condition
			// bug, so only log out if we aren't trying to authenticate.
			this.logout();
		}
	}

	// See http://stackoverflow.com/questions/26390027/firebase-authwithoauthredirect-woes for
	// the bug we are trying to work around here.
	checkAuthenticatedWithRetries(retry) {
		console.log('checkAuthenticatedWithRetries: ' + retry);
		var authData = this.checkAuthenticated();
		if (authData) {
			sessionStorage.setItem('loginStoreAuthenticating', '');
			this.emitChange();
			return authData;
		}

		if (retry && retry >= 4) {
			console.log('checkAuthenticatedWithRetries: unsuccessful');
			// No auth data on the third try, give up and set user as logged out.
			sessionStorage.setItem('loginStoreAuthenticating', '');
			sessionStorage.setItem('user', '');
			this.user = null;
			this.emitChange();
			return null;
		}

		setTimeout(function() {
			if (!retry) retry = 0;
			retry += 1;
			this.checkAuthenticatedWithRetries(retry);
		}.bind(this), 500)
		return null;
	}

	checkAuthenticated() {
		var authData = DataServices.GetAuthData();
		if (authData) {
			this.authenticated = true;
			sessionStorage.setItem('loginStoreAuthenticating', '');
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			return authData;
		} else {
			this.authenticated = false;
		}
	}

	addLoggedInChangeListener(callback) {
		this.addChangeListener(callback, ChangeEventEnum.LOGGED_IN);
	}
	removedLoggedInChangeListener(callback) {
		this.removeChangeListener(callback, ChangeEventEnum.LOGGED_IN);
	}

	addChangeListener(callback, changeEvent? : ChangeEventEnum) {
		if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
		this.on(changeEvent.toString(), callback);
	}

	// @param {function} callback
	removeChangeListener(callback, changeEvent? : ChangeEventEnum) {
		if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
		this.removeListener(changeEvent.toString(), callback);
	}

	isLoggedIn() {
		return this.authenticated && !!this.user;
	}

	authenticate() {
		// Don't make duplicate calls for authenticating. We have to save these in session storage
		// rather than class variables because the redirect will cause us to lose all state.
		// We will expect the onAuth callback to be called once the user is redirected back here and
		// authenticated.
		// See http://stackoverflow.com/questions/26390027/firebase-authwithoauthredirect-woes for
		// some subtle issues around this process.
		if (sessionStorage.getItem('loginStoreAuthenticating')) return;
		sessionStorage.setItem('loginStoreAuthenticating', 'true');
		DataServices.LoginWithFacebookRedirect();
	}

	logout () {
		DataServices.LogOut();
		if (this.user) {
			DataServices.DetachListener(
				"users/" + this.user.id,
				this.onUserDownloaded.bind(this));
		}
		this.user = null;
		sessionStorage.clear();
		localStorage.clear();
		LoginActions.userLoggedOut();
	}

	onUserDownloaded(data) {
		var authData = this.checkAuthenticated() as any;
		// We are authenticated but no user exists for us, insert a new user.
		if (authData && data.val() == null) {
			this.user = new Volunteer(authData.facebook.displayName, authData.facebook.email);
			this.user.id = authData.uid;
			this.user.insert();
			this.hasUser = true;
		} else if (authData && data.val()){
			this.user = new Volunteer('', '').castObject(data.val());
			this.hasUser = true;
		} else {
			this.hasUser = false;
		}
		this.resolve();
		this.emitChange();
	}

	isAuthenticated() {
		return this.authenticated;
	}

	getUserFromStorage() {
		try {
			return JSON.parse(sessionStorage.getItem("user"));
		} catch (error) {
			console.log('Failed to parse user value ' + sessionStorage.getItem("user"));
			sessionStorage.setItem('user', '');
			return null;
		}
	}

	downloadAndAuthenticateUser() {
		var authData = this.checkAuthenticated();
		if (authData) {
			this.downloadUser(authData.uid);
		} else if (!this.authenticated && !sessionStorage.getItem('loginStoreAuthenticating')) {
			this.authenticate();
		} else {
			this.reject();
		}
	}

	downloadUser(userId) {
		if (this.userDownloading) return;
		this.userDownloading = true;
		DataServices.DownloadData(
			'users/' + userId,
			this.onUserDownloaded.bind(this),
			this.reject.bind(this));
	}

	getUser() {
		if (this.user && this.authenticated) return this.user;
		if (this.userDownloading || this.authenticated === false || this.hasUser === false) {
			return null;
		}
		this.downloadAndAuthenticateUser();
		return null;
	}

	clearPromiseFunctions () {
		this.resolveMe = null;
		this.rejectMe = null;
	}

	reject() {
		if (this.rejectMe) { this.rejectMe(); }
		this.clearPromiseFunctions();
		this.userDownloading = false;
	}

	resolve() {
		if (this.resolveMe) { this.resolveMe(this.user); }
		this.clearPromiseFunctions();
		this.userDownloading = false;
	}

	ensureUser() {
		return new Promise(function(resolve, reject) {
			if (this.user && this.authenticated) {
				resolve(this.user);
				return;
			}
			this.resolveMe = function (data) {
				resolve(data)
			};
			this.rejectMe = function (error) {
				reject(error);
			};
			return this.getUser();
		}.bind(this));
	}

	emitChange(changeEvent? : ChangeEventEnum) {
		this.emit(ChangeEventEnum.ANY.toString());
		if (changeEvent) {
			this.emit(changeEvent.toString());
		}
	}

	handleAction(action) {
		switch (action.type) {
			case ActionConstants.LOGIN_USER_SUCCESS:
				this.user = action.user;
				sessionStorage.setItem("user", JSON.stringify(this.user));
				this.emitChange(ChangeEventEnum.LOGGED_IN);
				break;

			case ActionConstants.LOGIN_USER_ERROR:
				this.emitChange();
				break;

			case ActionConstants.LOGOUT_USER:
				console.log("LoginStore:handleAction:LOGOUT_USER");
				this.emitChange();
				break;

			default:
				break;
		};
	}
};

export default new LoginStore();
