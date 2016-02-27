"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Volunteer = require('../core/volunteer');
var LoginActions = require("../actions/loginactions");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class VolunteerStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            outer.handleAction(action);
        });
        this.volunteers = {};
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    // @param {function} callback
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    getVolunteerById(userId) {
        if (this.volunteers[userId]) return this.volunteers[userId];

        console.log("downloading user " + userId);
        var outer = this;
        var onSuccess = function (user) {
            outer.volunteers[user.id] = user;
            outer.emitChange();
        };
        Volunteer.LoadVolunteer(userId, "", "", onSuccess)
        return null;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    handleAction(action) {
        switch (action.type) {
            //case ActionConstants.MEMBER_UPDATED:
            //    this.emitChange();
            //    break;

            default:
                break;
        };
    }
};

module.exports = new VolunteerStore();
