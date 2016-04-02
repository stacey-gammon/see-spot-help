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
		this.checkAuthenticated();
		this.userInBeta = false;
		this.isAuthenticating = false;
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
		return !!this.user;
	}

	authenticateWithUsernameAndPassword(email, password) {
		var onSuccess = function (authData) {
			Volunteer.LoadVolunteer(
				authData.uid, "anon", email, LoginActions.userLoggedIn);
			this.authenticated = true;
		}.bind(this);
		var onError = function () {
			this.authenticated = false;
		}.bind(this);
		DataServices.AuthenticateWithEmailAndPassword(email, password, onSuccess, onError);
	}

	authenticate(onSuccess, onError) {
		// Don't make duplicate calls for authenticating.
		if (this.isAuthenticating) return;
		this.isAuthenticating = true;
		var myOnSuccess = function() {
			this.authenticated = true;
			this.isAuthenticating = false;
			this.emitChange();
			if (onSuccess) onSuccess();

		}.bind(this);
		var myOnError = function() {
			this.authenticated = false;
			this.isAuthenticating = false;
			this.emitChange();
			if (onError) onError();
		}.bind(this);
		LoginService.loginWithFirebaseFacebook(myOnSuccess, myOnError);
	}

	onUserDownloaded(user) {
		this.user = Volunteer.castObject(user);
		this.emitChange();
	}

	isAuthenticated() {
		if (this.authenticated === undefined) {
			this.checkAuthenticated();
		}
		return this.authenticated;
	}

	// In case of a hard refresh, always attempt to re-grab the user data from local
	// storage if it doesn't exist.
	getUser() {
		if (!this.user && !this.listenersAttached) {
			var user = JSON.parse(localStorage.getItem("user"));

			var onAuthenticated = function () {
				new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
					"users/" + user.id, true);
			}.bind(this);
			if (user) {
				this.listenersAttached = true;

				if (!this.isAuthenticated() && !this.isAuthenticating) {
					this.authenticate(onAuthenticated);
				} else {
					onAuthenticated();
				}
			} else {
				// The authentication causes a page refresh, so we may not have a user but be
				// authenticated anyway.
				var authData = this.checkAuthenticated();
				if (this.authenticated) {
					new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
						"users/" + authData.uid, true);
				}
			}
		}

		return this.isAuthenticated() ? this.user : null;
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
				localStorage.setItem("user", JSON.stringify(this.user));
				this.error = null;
				this.emitChange(ChangeEventEnum.LOGGED_IN);
				break;

			case ActionConstants.LOGIN_USER_ERROR:
				this.error = action.error;
				this.emitChange();
				break;

			case ActionConstants.LOGOUT_USER:
				console.log("LoginStore:handleAction:LOGOUT_USER");
				DataServices.DetachListener(
					"users/" + this.user.id,
					this.onUserDownloaded.bind(this));
				this.user = null;
				this.error = null;
				localStorage.setItem("user", null);
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
