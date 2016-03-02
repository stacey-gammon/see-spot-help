"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
var LoginStore = require("../stores/loginstore");

var AnimalActions = {
    animalActivityAdded: function (activity) {
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_ACTIVITY_ADDED,
            activity: activity
        });
    },
    animalActivityDeleted: function (activity) {
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_ACTIVITY_DELETED,
            activity: activity
        });
    },
};

module.exports = AnimalActions;
