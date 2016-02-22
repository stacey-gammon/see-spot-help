"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var AJAXServices = require('../core/AJAXServices');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class GroupStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            console.log("GroupStore:Dispatcher:register");
            outer.handleAction(action);
        });
        this.groups = {};
    }

    addChangeListener(callback) {
        console.log("LoginStore:addChangeListener");
        this.on(CHANGE_EVENT, callback);
    }

    // @param {function} callback
    removeChangeListener(callback) {
        console.log("LoginStore:removeChangeListener");
        this.removeListener(CHANGE_EVENT, callback);
    }

    getGroupById(groupId) {
        return this.groups[groupId];
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    loadGroupsForUser(user) {
        var outer = this;
        var onSuccess = function (groupPermissions) {
            console.log("Loaded users group permissions: ");
            console.log(groupPermissions);
            var groupLoaded = function (group) {
                console.log("Loading group");
                console.log(group);
                outer.groups[group.id] = group;
                outer.emitChange();
            };

            for (var prop in groupPermissions) {
                var dataServices = new AJAXServices(groupLoaded, null);
                console.log("prop = " + prop);
                dataServices.GetFirebaseData("groups/" + prop);
            }
        };

        var dataServices = new AJAXServices(onSuccess, null);
        dataServices.GetFirebaseData("groupPermissions/" + user.id);
    }

    handleAction(action) {
        console.log("GroupStore:handleAction: " + action.type);
        switch (action.type) {
            case ActionConstants.NEW_GROUP_ADDED:
                this.groups[action.group.id] = action.group;
                this.emitChange();
                break;
            case ActionConstants.LOGIN_USER_SUCCESS:
                this.loadGroupsForUser(action.user);
            default:
                break;
        };
    }
};

module.exports = new GroupStore();
