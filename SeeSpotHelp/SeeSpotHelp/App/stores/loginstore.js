"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Volunteer = require('../core/volunteer');
var LoginActions = require("../actions/loginactions");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class LoginStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            outer.handleAction(action);
        });
        var users = {};
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    // @param {function} callback
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    isLoggedIn() {
        return !!this.user;
    }

    // In case of a hard refresh, always attempt to re-grab the user data from local
    // storage if it doesn't exist.
    getUser() {
        if (!this.user) {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                console.log("grabbing user from local storage");
                var onSuccess = function (user) {
                    user = Volunteer.castObject(user);
                    LoginActions.userLoggedIn(user);
                };
                Volunteer.LoadVolunteer(user.id, "", "", onSuccess);
            }
        }
        return this.user;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    handleAction(action) {
        switch (action.type) {
            case ActionConstants.LOGIN_USER_SUCCESS:
                this.user = action.user;
                localStorage.setItem("user", JSON.stringify(this.user));
                this.error = null;
                this.emitChange();
                break;

            case ActionConstants.LOGIN_USER_ERROR:
                this.error = action.error;
                this.emitChange();
                break;

            case ActionConstants.LOGOUT_USER:
                console.log("LoginStore:handleAction:LOGOUT_USER");
                this.user = null;
                this.error = null;
                localStorage.setItem("user", null);
                this.emitChange();
                break;

            case ActionConstants.NEW_GROUP_ADDED:
                this.user.defaultGroupId = action.group.id;
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
