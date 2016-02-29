"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
var LoginStore = require("../stores/loginstore");

var GroupActions = {
    newGroupAdded: function (group) {
        console.log("GroupActions:newGroupAdded");
        Dispatcher.dispatch({
            type: ActionConstants.NEW_GROUP_ADDED,
            group: group
        });
    },

    groupDeleted: function (group) {
        console.log("GroupActions:groupDeleted");
        Dispatcher.dispatch({
            type: ActionConstants.GROUP_DELETED,
            group: group
        });
    },

    groupUpdated: function(group) {
        console.log("GroupActions:groupUpdated");
        Dispatcher.dispatch({
            type: ActionConstants.GROUP_UPDATED,
            group: group
        });
    },

    newAnimalAdded: function (group, animal) {
        console.log("GroupActions:newAnimalAdded");
        Dispatcher.dispatch({
            type: ActionConstants.NEW_ANIMAL_ADDED,
            group: group,
            animal: animal
        });
    },

    animalUpdated: function (group, animal) {
        console.log("GroupActions:animalUpdated");
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_UPDATED,
            group: group,
            animal: animal
        });
    },
};

module.exports = GroupActions;
