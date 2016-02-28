"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
var LoginStore = require("../stores/loginstore");

var AnimalActions = {
    animalActivityAdded: function (activity) {
        console.log("AnimalActions:animalUpdated");
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_ACTIVITY_ADDED,
            activity: activity
        });
    },
};

module.exports = AnimalActions;
