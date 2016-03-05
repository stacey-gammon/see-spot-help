"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');

var AnimalActions = {
    animalAdded: function (animal) {
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_ADDED,
            animal: animal
        });
    },
    animalDeleted: function (animal) {
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_DELETED,
            animal: animal
        });
    },
    animalChanged: function (animal) {
        Dispatcher.dispatch({
            type: ActionConstants.ANIMAL_CHANGED,
            animal: animal
        });
    },
};

module.exports = AnimalActions;
