"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var AJAXServices = require('../core/AJAXServices');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class PermissionsStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            console.log("GroupStore:Dispatcher:register");
            outer.handleAction(action);
        });
        this.groupPermissions = {};
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

    getMemberGroupIds () {
        var memberGroups = [];
        for (var groupId in groupPermissions) {
            if (groupPermisions[groupId] != VolunteerGroup.PermissionsEnum.NONMEMBER) {
                memberGroupIds.push(groupId);
            }
        }
        return memberGroupIds;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    handleAction(action) {
        console.log("GroupStore:handleAction: " + action.type);
        switch (action.type) {
            case ActionConstants.LOGIN_USER_SUCCESS:
                // this.loadGroupsForUser(action.user);
            default:
                break;
        };
    }
};

module.exports = new PermissionsStore();
