"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');
import LoginStore from '../stores/loginstore';

var GroupActions = {
	newGroupAdded: function (group) {
		Dispatcher.dispatch({
			type: ActionConstants.NEW_GROUP_ADDED,
			group: group
		});
	},

	groupDeleted: function (group) {
		Dispatcher.dispatch({
			type: ActionConstants.GROUP_DELETED,
			group: group
		});
	},

	groupUpdated: function(group) {
		Dispatcher.dispatch({
			type: ActionConstants.GROUP_UPDATED,
			group: group
		});
	},

	newAnimalAdded: function (group, animal) {
		Dispatcher.dispatch({
			type: ActionConstants.NEW_ANIMAL_ADDED,
			group: group,
			animal: animal
		});
	},

	animalUpdated: function (group, animal) {
		Dispatcher.dispatch({
			type: ActionConstants.ANIMAL_UPDATED,
			group: group,
			animal: animal
		});
	},
};

export = GroupActions;
