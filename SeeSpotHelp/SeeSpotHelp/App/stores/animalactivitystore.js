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
        this.userNotes = {};
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

    downloadAnimalNotes(animalId) {
        var outer = this;
        var onSuccess = function(notes) {
            outer.animalNotes[animalId] = [];
            for (var noteId in notes) {
                var animalNote = AnimalNote.castObject(notes[noteId]);
                outer.animalNotes[animalId].push(animalNote);
                console.log("Downloaded note: ", animalNote);
            }
            outer.emitChange();
        };
        AJAXServices.GetChildData("notes", "animalId", animalId, onSuccess);
    }

    getActivityByAnimalId(animalId) {
        console.log("AnimalActivityStore:getActivityByAnimalId(" + animalId + ")");
        if (this.animalNotes[animalId]) {
            return this.animalNotes[animalId];
        } else {
            this.downloadAnimalNotes(animalId);
            return [];
        }
    }

    handleAction(action) {
        switch (action.type) {
            case ActionConstants.ANIMAL_ACTIVITY_ADDED:
                this.animalNotes[action.activity.animalId].push(action.activity);
                this.emitChange();
            default:
                break;
        };
    }
};

module.exports = new AnimalActivityStore();
