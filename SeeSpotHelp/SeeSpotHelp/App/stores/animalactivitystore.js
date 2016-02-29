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

    animalNotesDownloaded(notes) {
        var animalId;
        var notesFound = false;
        for (var noteId in notes) {
            animalId = notes[noteId].animalId;
            var animalNote = AnimalNote.castObject(notes[noteId]);
            if (!this.animalNotes[animalId]) {
                this.animalNotes[animalId] = [];
            }
            this.animalNotes[animalId].push(animalNote);
            notesFound = true;
        }
        if (notesFound) {
            this.animalNotes[animalId].sort(function(a, b){
                return a.timestamp < b.timestamp ? 1 : -1;
            });
        }
        this.emitChange();
    }

    downloadAnimalNotes(animalId) {
        // So we don't try to download it again if there are no notes (e.g. differentiate from
        // null).
        this.animalNotes[animalId] = [];

        AJAXServices.GetChildData(
            "notes",
            "animalId",
            animalId,
            this.animalNotesDownloaded.bind(this),
            true);
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
                this.animalNotes[action.activity.animalId].sort(function(a, b){
                    return a.timestamp < b.timestamp ? 1 : -1;
                });
                this.emitChange();
            default:
                break;
        };
    }
};

module.exports = new AnimalActivityStore();
