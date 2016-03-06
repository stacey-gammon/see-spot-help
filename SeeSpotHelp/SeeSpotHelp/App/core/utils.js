
var Utils = function () { }

Utils.CopyInputFieldsIntoObject = function (inputFields, object) {
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
Utils.FindPassedInProperty = function (reactClass, property) {
	if (reactClass.props[property]) {
		return reactClass.props.property;
	} else if (reactClass.props.location && reactClass.props.location.state[property]) {
		return reactClass.props.location.state[property];
	} else {
		return null;
	}
}

module.exports = Utils;
