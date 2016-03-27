var React = require('react');
var Volunteer = require('./volunteer');
var VolunteerGroup = require('./volunteergroup');
var Animal = require('./animal');
var Schedule = require('./schedule');

var SessionStorageClasses = {};
SessionStorageClasses['Volunteer'] = Volunteer;
SessionStorageClasses['VolunteerGroup'] = VolunteerGroup;
SessionStorageClasses['Animal'] = Animal;
SessionStorageClasses['Schedule'] = Schedule;

var Utils = function() { }

Utils.CopyInputFieldsIntoObject = function(inputFields, object) {
	for (var fieldName in inputFields) {
		object[fieldName] = inputFields[fieldName].value;
	}
}

// Unfortunately in React there are many ways to pass values from one component to another.
// For example, transferring the user to another page via LinkContainer puts the state
// variables in reactClass.props.location.state.  Passing a property along with html, e.g.
// <MyComponent myproperty="value"/> is accessed via this.props.  I suppose we should Probably
// keep track of each way the different pages and components are accessed and variables passed
// along but this is easy for now to just check all ways.
Utils.FindPassedInProperty = function(reactClass, property) {
	if (reactClass.props[property]) {
		return reactClass.props[property];
	} else if (reactClass.props.location &&
		reactClass.props.location.state &&
		reactClass.props.location.state[property]) {
		return reactClass.props.location.state[property];
	} else {
		return null;
	}
}

Utils.GenerateClass = function(className) {
	return SessionStorageClasses[className];
};

// Loops through properties on the state object. Any that are null or empty are attempted to be
// retrieved from session storage. Any that aren't are stored in session storage.
Utils.LoadOrSaveState = function(state) {
	for (var prop in state) {
		if (state[prop] === null) {
			Utils.LoadStateProp(state, prop);
		} else {
			Utils.SaveStateProp(state, prop);
		}
	}
}

Utils.SaveStateProp = function(state, prop) {
	sessionStorage.setItem(prop, JSON.stringify(state[prop]));
}

Utils.LoadStateProp = function(state, prop) {
	try {
		state[prop] = JSON.parse(sessionStorage.getItem(prop));
		if (state[prop] && state[prop].classNameForSessionStorage) {
			var ClassName = Utils.GenerateClass(state[prop].classNameForSessionStorage);
			var instance = new ClassName();
			state[prop] = Object.assign(instance, state[prop]);

			// Special handling for VolunteerGroup which has nested Animal objects which also need
			// to be casted
			if (state[prop].classNameForSessionStorage == 'VolunteerGroup') {
				var group = state[prop];
				for (var animalId in group.animals) {
					group.animals[animalId] = Animal.castObject(group.animals[animalId]);
				}
			}
		}
	} catch (error) {
		console.log("Failed to load property " + prop + " into state");
	}
}

Utils.getCalendarGlyphicon = function () {
	var title = screen.width < 600 ? '' : 'Calendar';
	var iconSize = screen.width < 600 ? '20px' : '15px';
	return React.createElement("div", null,
		React.createElement(
			"span", { className: "glyphicon glyphicon-calendar", style: {fontSize: iconSize}}
		),
		'  ' + title
	);
};

Utils.getActivityGlyphicon = function () {
	var title = screen.width < 600 ? '' : 'Activity';
	var iconSize = screen.width < 600 ? '20px' : '15px';
	return React.createElement("div", null,
		React.createElement(
			"span", { className: "glyphicon glyphicon-list", style: {fontSize: iconSize}}
		),
		'  ' + title
	);
};

module.exports = Utils;
