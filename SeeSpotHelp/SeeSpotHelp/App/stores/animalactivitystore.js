"use strict";

var Dispatcher = require("../dispatcher/dispatcher");
var ActionConstants = require('../constants/actionconstants');
var VolunteerGroup = require('../core/volunteergroup');
var AnimalNote = require("../core/animalnote");
var AJAXServices = require('../core/AJAXServices');
var Firebase = require("firebase");

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

class AnimalActivityStore extends EventEmitter {
    constructor() {
        super();
        var outer = this;
        this.dispatchToken = Dispatcher.register(function (action) {
            console.log("AnimalStore:Dispatcher:register");
            outer.handleAction(action);
        });

        this.animalNotes = {};
        this.userActivity = {};
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

    userActivityAdded(snapshot) {
        if (snapshot.val()) {
            var activity = AnimalNote.castObject(snapshot.val());
            // Wait for the subsequent update call. This is all inefficient.
            if (activity.id == null) return;
            var userId = activity.byUserId;
            if (!this.userActivity[userId]) {
                this.userActivity[userId] = [];
            }
            this.userActivity[userId].push(activity);
            this.userActivity[userId].sort(function(a, b){
                return a.timestamp < b.timestamp ? 1 : -1;
            });
            this.emitChange();
        }
    }

    userActivityDeleted(snapshot) {
        var deletedActivity = snapshot.val();
        var activities = this.userActivity[deletedActivity.userId];
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].id == deletedActivity.id) {
                this.userActivity[deletedActivity.byUserId].splice(i, 1);
                this.emitChange();
                return;
            }
        }
    }

    userActivityChanged(snapshot) {
        var changedActivity = AnimalNote.castObject(snapshot.val());
        var activities = this.userActivity[changedActivity.byUserId];
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].id == changedActivity.id) {
                activities[i] = changedActivity;
                this.emitChange();
                return;
            }
        }
        // Most likely a push call followed by an update call so we can store the id in the
        // object.
        this.activityAdded(snapshot);
    }

    activityAdded(snapshot) {
        if (snapshot.val()) {
            var activity = AnimalNote.castObject(snapshot.val());
            // Wait for the subsequent update call. This is all inefficient.
            if (activity.id == null) return;
            var animalId = activity.animalId;
            if (!this.animalNotes[animalId]) {
                this.animalNotes[animalId] = [];
            }
            this.animalNotes[animalId].push(activity);
            this.animalNotes[animalId].sort(function(a, b){
                return a.timestamp < b.timestamp ? 1 : -1;
            });
            this.emitChange();
        }
    }

    activityDeleted(snapshot) {
        var deletedActivity = snapshot.val();
        var activities = this.animalNotes[deletedActivity.animalId];
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].id == deletedActivity.id) {
                this.animalNotes[deletedActivity.animalId].splice(i, 1);
                this.emitChange();
                return;
            }
        }
    }

    activityChanged(snapshot) {
        var changedActivity = AnimalNote.castObject(snapshot.val());
        var activities = this.animalNotes[changedActivity.animalId];
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].id == changedActivity.id) {
                activities[i] = changedActivity;
                this.emitChange();
                return;
            }
        }
        // Most likely a push call followed by an update call so we can store the id in the
        // object.
        this.activityAdded(snapshot);
    }

    getActivityById(id) {
        // TODO: may have to change this data structure so we can avoid
        // the loops.
        for (var activities in this.animalNotes) {
            for (var i = 0; i < this.animalNotes[activities].length; i++) {
                var activity = this.animalNotes[activities][i];
                if (activity.id == id) return activity;
            }
        }
    }

    downloadAnimalNotes(animalId) {
        // So we don't try to download it again if there are no notes (e.g. differentiate from
        // null).
        this.animalNotes[animalId] = [];

        AJAXServices.OnMatchingChildAdded(
            "notes",
            "animalId",
            animalId,
            this.activityAdded.bind(this));
        AJAXServices.OnMatchingChildRemoved(
            "notes",
            "animalId",
            animalId,
            this.activityDeleted.bind(this));
        AJAXServices.OnMatchingChildChanged(
            "notes",
            "animalId",
            animalId,
            this.activityChanged.bind(this));
    }

    downloadUserActivity(userId) {
        // So we don't try to download it again if there are no notes (e.g. differentiate from
        // null).
        this.userActivity[userId] = [];

        AJAXServices.OnMatchingChildAdded(
            "notes",
            "byUserId",
            userId,
            this.userActivityAdded.bind(this));
        AJAXServices.OnMatchingChildRemoved(
            "notes",
            "byUserId",
            userId,
            this.userActivityDeleted.bind(this));
        AJAXServices.OnMatchingChildChanged(
            "notes",
            "byUserId",
            userId,
            this.userActivityChanged.bind(this));
    }

    getActivityByAnimalId(animalId) {
        if (this.animalNotes[animalId]) {
            return this.animalNotes[animalId];
        } else {
            this.downloadAnimalNotes(animalId);
            return [];
        }
    }

    getActivityByUserId(userId) {
        if (this.userActivity[userId]) {
            return this.userActivity[userId];
        } else {
            this.downloadUserActivity(userId);
            return [];
        }
    }

    handleAction(action) {
        switch (action.type) {
            default:
                break;
        };
    }
};

module.exports = new AnimalActivityStore();
