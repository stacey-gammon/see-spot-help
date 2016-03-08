"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var Volunteer = require('../core/volunteer');
var LoginActions = require("../actions/loginactions");
var VolunteerGroup = require('../core/volunteergroup');
var DataServices = require('../core/dataservices');

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

class LoginStore extends EventEmitter {
	constructor() {
		super();
		this.ChangeEventEnum = LoginStore.ChangeEventEnum;
		var outer = this;
		this.dispatchToken = Dispatcher.register(function (action) {
			outer.handleAction(action);
		});
		var users = {};
		var listenersAttached = false;
	}

	addChangeListener(callback, changeEvent) {
		if (!changeEvent) changeEvent = LoginStore.ChangeEventEnum.ANY;
		this.on(changeEvent, callback);
	}

	// @param {function} callback
	removeChangeListener(callback, changeEvent) {
		if (!changeEvent) changeEvent = LoginStore.ChangeEventEnum.ANY;
		this.removeListener(changeEvent, callback);
	}

	isLoggedIn() {
		return !!this.user;
	}

	onUserDownloaded(user) {
		console.log("LoginStore:onUserDownloaded: ", user);
		this.user = Volunteer.castObject(user);
		this.emitChange();
	}

	// In case of a hard refresh, always attempt to re-grab the user data from local
	// storage if it doesn't exist.
	getUser() {
		if (!this.user && !this.listenersAttached) {
			var user = JSON.parse(localStorage.getItem("user"));
			if (user) {
				this.listenersAttached = true;
				new DataServices(this.onUserDownloaded.bind(this), null).GetFirebaseData(
					"users/" + user.id, true);
			}
		}
		return this.user;
	}

	emitChange(changeEvent) {
		this.emit(LoginStore.ChangeEventEnum.ANY);
		if (changeEvent) {
			this.emit(changeEvent);
		}
	}

	handleAction(action) {
		switch (action.type) {
			// case ActionConstants.USER_UPDATED:
			//	 console.log("LoginStore:handleAction: USER_UPDATED with user: ",
			//				 action.user);
			//	 this.user = action.user;
			//	 localStorage.setItem("user", JSON.stringify(this.user));
			//	 this.error = null;
			//	 this.emitChange();
			//	 break;
			case ActionConstants.LOGIN_USER_SUCCESS:
				this.user = action.user;
				localStorage.setItem("user", JSON.stringify(this.user));
				this.error = null;
				this.emitChange(LoginStore.ChangeEventEnum.LOGGED_IN);
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

LoginStore.ChangeEventEnum = {
	ANY: 'ANY',
	LOGGED_IN: 'LOGGED_IN'
};

module.exports = new LoginStore();
