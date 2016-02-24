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
        this.loadedUserGroups = false;
    }

    loadedUserGroups() {
        return this.loadedUserGroups;
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
        console.log("GetGroupById, groups =");
        console.log(this.groups);
        return this.groups[groupId];
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getUsersMemberGroups(user) {
        var usersGroups = []
        for (var groupId in this.groups) {
            console.log("Group: ");
            console.log(this.groups[groupId]);
            if (this.groups[groupId].userPermissionsMap[user.id] !=
                    VolunteerGroup.PermissionsEnum.NONMEMBER) {
                usersGroups.push(this.groups[groupId]);
            }
        }
        return usersGroups;
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
                outer.loadedUserGroups = true;
            };

            var userInGroups = false;
            for (var prop in groupPermissions) {
                var dataServices = new AJAXServices(groupLoaded, null);
                console.log("prop = " + prop);
                dataServices.GetFirebaseData("groups/" + prop);
                userInGroups = false;
            }

            if (!userInGroups) {
                outer.loadedUserGroups = true;
                outer.emitChange();
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
