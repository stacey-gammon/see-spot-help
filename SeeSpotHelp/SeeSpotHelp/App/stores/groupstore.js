"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var Animal = require('../core/animal');
var AJAXServices = require('../core/AJAXServices');
var Firebase = require("firebase");
var GroupActions = require("../actions/groupactions");

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
        this.on(CHANGE_EVENT, callback);
    }

    // @param {function} callback
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    getGroupById(groupId) {
        if (!this.groups[groupId]) {
            console.log("group requested that hasn't been downloaded.  Downloading now...");
            this.downloadGroup(groupId);
        }
        return this.groups[groupId];
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    getUsersMemberGroups(user) {
        var usersGroups = []
        for (var groupId in user.groups) {
            console.log("getUsersMemberGroups:GroupId:", groupId);
            if (!this.groups[groupId]) {
                this.downloadGroup(groupId);
                continue;
            }
            if (user.id in this.groups[groupId].userPermissionsMap &&
                this.groups[groupId].userPermissionsMap[user.id] !=
                    VolunteerGroup.PermissionsEnum.NONMEMBER &&
                this.groups[groupId].userPermissionsMap[user.id] !=
                    VolunteerGroup.PermissionsEnum.MEMBERSHIPDENIED) {
                usersGroups.push(this.groups[groupId]);
            }
        }
        return usersGroups;
    }

    groupDownloaded(group) {
        if (!group) {
            console.log("WARN: group loaded data is null");
            return;
        }
        console.log("groupDownloaded: group ", group);
        group = VolunteerGroup.castObject(group);
        for (var animal in group.animals) {
            group.animals[animal] = Animal.castObject(group.animals[animal]);
        }
        this.groups[group.id] = group;
        this.emitChange();
        this.loadedUserGroups = true;
    }

    downloadGroup(groupId) {
        var outer = this;
        var dataServices = new AJAXServices(this.groupDownloaded.bind(this), null);
        dataServices.GetFirebaseData("groups/" + groupId, true);
    }

    loadGroupsForUser(user) {
        var outer = this;
        var onSuccess = function (groups) {
            console.log("Loaded users groups: ");
            console.log(groups);

            var userInGroups = false;
            for (var groupId in groups) {
                outer.downloadGroup(groupId);
                userInGroups = false;
            }

            if (!userInGroups) {
                outer.loadedUserGroups = true;
                outer.emitChange();
            }
        };

        var dataServices = new AJAXServices(onSuccess, null);
        dataServices.GetFirebaseData("users/" + user.id + "/groups");
    }

    handleAction(action) {
        console.log("GroupStore:handleAction: " + action.type);
        switch (action.type) {
            case ActionConstants.NEW_GROUP_ADDED:
                this.groups[action.group.id] = action.group;
                this.emitChange();
                break;
            case ActionConstants.NEW_ANIMAL_ADDED:
            case ActionConstants.ANIMAL_UPDATED:
                this.groups[action.group.id].animals[action.animal.id] = action.animal;
                this.emitChange();
                break;
            case ActionConstants.LOGIN_USER_SUCCESS:
                this.loadGroupsForUser(action.user);
                break;
            case ActionConstants.GROUP_DELETED:
                console.log("GroupStore:handleaction: caught GROUP_DELETED");
                AJAXServices.DetachLisenter(
                    "groups/" + action.group.id,
                    this.groupDownloaded.bind(this));
                delete this.groups[action.group.id];
                this.emitChange();
                break;
            default:
                break;
        };
    }
};

module.exports = new GroupStore();
