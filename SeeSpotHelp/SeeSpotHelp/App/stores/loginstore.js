"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var Volunteer = require('../core/volunteer');
var LoginActions = require("../actions/loginactions");
var VolunteerGroup = require('../core/volunteergroup');
var DataServices = require('../core/dataservices');
var LoginService = require('../core/loginservice');

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var ChangeEventEnum = {
	ANY: 'ANY',
	LOGGED_IN: 'LOGGED_IN'
};

class LoginStore extends EventEmitter {
	constructor() {
		super();
		this.ChangeEventEnum = ChangeEventEnum;
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			outer.handleAction(action);
		});
		var users = {};
		var listenersAttached = false;

		var ref = new Firebase(DataServices.firebaseURL);
		ref.onAuth(this.authDataChanged);

		this.checkAuthenticated();
		this.userInBeta = false;
		this.authError = null;

		if (this.isAuthenticating()) {
			this.checkAuthenticatedWithRetries(0);
		}
	}

	isAuthenticating() {
		return sessionStorage.loginStoreAuthenticating;
	}

	authDataChanged(authData) {
		if (!this) return;
		console.log('LoginStore.authDataChanged');
		if (authData) {
			delete sessionStorage.loginStoreAuthenticating;
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
			delete sessionStorage.loginStoreAuthenticating;
			this.authError = false;
			this.emitChange();
			return authData;
		}

		if (retry && retry >= 4) {
			console.log('checkAuthenticatedWithRetries: unsuccessful');
			// No auth data on the third try, give up and set user as logged out.
			delete sessionStorage.loginStoreAuthenticating;
			delete sessionStorage.user;
			this.authError = true;
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
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			return authData;
		} else {
			this.authenticated = false;
		}
	}

	addChangeListener(callback, changeEvent) {
		if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
		this.on(changeEvent, callback);
	}

	// @param {function} callback
	removeChangeListener(callback, changeEvent) {
		if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
		this.removeListener(changeEvent, callback);
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
		if (sessionStorage.loginStoreAuthenticating) return;
		sessionStorage.loginStoreAuthenticating = true;
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
		this.error = null;
		sessionStorage.clear();
		localStorage.clear();
		LoginActions.userLoggedOut();
	}

	onUserDownloaded(user) {
		console.log('onUserDownloaded', user);
		var authData = this.checkAuthenticated();
		// We are authenticated but no user exists for us, insert a new user.
		if (authData && user == null) {
			console.log('Loading volunteer with auth data');
			Volunteer.LoadVolunteer(
				authData.uid,
				authData.facebook.displayName,
				authData.facebook.email,
				LoginActions.userLoggedIn);
		}
		this.user = Volunteer.castObject(user);
		this.emitChange();
	}

	isAuthenticated() {
		this.checkAuthenticated();
		return this.authenticated;
	}

	// In case of a hard refresh, always attempt to re-grab the user data from local
	// storage if it doesn't exist.
	getUser() {
		if (!this.user && !this.listenersAttached) {
			console.log('LoginStore.getUser: no user object');
			var user = null;
			try {
				user = JSON.parse(sessionStorage.getItem("user"));
			} catch (error) {
				console.log('Failed to parse user value ' + sessionStorage.getItem("user"));
			}
			if (user) {
				if (!this.authenticated && !sessionStorage.loginStoreAuthenticating) {
					this.authenticate();
				} else {
					this.listenersAttached = true;
					new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
							"users/" + user.id, true);
				}
			} else {
				// The authentication causes a page refresh, so we may not have a user but be
				// authenticated anyway.
				var authData = this.checkAuthenticated();
				if (this.authenticated) {
					this.listenersAttached = true;
					new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
						"users/" + authData.uid, true);
				}
			}
		}

		return this.authenticated ? this.user : null;
	}

	emitChange(changeEvent) {
		this.emit(ChangeEventEnum.ANY);
		if (changeEvent) {
			this.emit(changeEvent);
		}
	}

	handleAction(action) {
		switch (action.type) {
			case ActionConstants.LOGIN_USER_SUCCESS:
				this.user = action.user;
				sessionStorage.setItem("user", JSON.stringify(this.user));
				this.error = null;
				this.emitChange(ChangeEventEnum.LOGGED_IN);
				break;

			case ActionConstants.LOGIN_USER_ERROR:
				this.error = action.error;
				this.emitChange();
				break;

			case ActionConstants.LOGOUT_USER:
				console.log("LoginStore:handleAction:LOGOUT_USER");
				// DataServices.DetachListener(
				// 	"users/" + this.user.id,
				// 	this.onUserDownloaded.bind(this));
				// this.user = null;
				// this.error = null;
				// sessionStorage.setItem("user", null);
				this.emitChange();
				break;

			case ActionConstants.NEW_GROUP_ADDED:
			console.log("LoginStore:handleAction: Caught NEW_GROUP_ADDED");
				this.user.groups[action.group.id] =
					VolunteerGroup.PermissionsEnum.ADMIN;
				this.emitChange();
				break;

			default:
				break;
		};
	}
};

module.exports = new LoginStore();
