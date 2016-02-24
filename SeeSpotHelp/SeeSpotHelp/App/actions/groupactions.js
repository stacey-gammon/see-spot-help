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
    newAnimalAdded: function (group, animal) {
        console.log("GroupActions:newAnimalAdded");
        Dispatcher.dispatch({
            type: ActionConstants.NEW_ANIMAL_ADDED,
            group: group,
            animal: animal
        });
    },
};

module.exports = GroupActions;
