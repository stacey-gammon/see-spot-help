"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
var LoginStore = require("../stores/loginstore");

var LoginActions = {
    userLoggedIn: function (user) {
        console.log("LoginActions:userLoggedIn");
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

    userLoggedOut: function () {
        console.log("LoginActions:userLoggedOut");
        Dispatcher.dispatch({
            type: ActionConstants.LOGOUT_USER
        });
    },
};

module.exports = LoginActions;
