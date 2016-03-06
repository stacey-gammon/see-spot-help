"use strict"

var Dispatcher = require('../dispatcher/dispatcher');
var ActionConstants = require('../constants/actionconstants');

var VolunteerActions = {
	memberDownloaded: function () {
		Dispatcher.dispatch({
			type: ActionConstants.MEMBER_DOWNLOADED
		});
	},
};

module.exports = VolunteerActions;
