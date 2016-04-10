"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');

var LoginActions = {
	userUpdated: function (user) {
		Dispatcher.dispatch({
			type: ActionConstants.USER_UPDATED,
			user: user
		});
	},

	userLoggedIn: function (user) {
		Dispatcher.dispatch({
			type: ActionConstants.LOGIN_USER_SUCCESS,
			user: user
		});
	},

	userLogInFailed: function (error) {
		Dispatcher.dispatch({
			type: ActionConstants.LOGIN_USER_ERROR,
			error: error
		});
	},

	loginStatusChanged: function (response) {
		if (response.state == "unknown") {
			userLoggedOut();
		}
	},

	userLoggedOut: function () {
		Dispatcher.dispatch({
			type: ActionConstants.LOGOUT_USER
		});
	},
};

module.exports = LoginActions;
