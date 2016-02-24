"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var AJAXServices = require('../core/AJAXServices');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class AnimalStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            console.log("GroupStore:Dispatcher:register");
            outer.handleAction(action);
        });
        this.animals = {};
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    // @param {function} callback
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    handleAction(action) {
        switch (action.type) {
            case ActionConstants.LOGIN_USER_SUCCESS:
              //  this.loadGroupPermissionsForUser(action.user);
            default:
                break;
        };
    }
};

module.exports = new AnimalStore();
