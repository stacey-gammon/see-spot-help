
var Utils = function () { }

Utils.CopyInputFieldsIntoObject = function (inputFields, object) {
	for (var fieldName in inputFields) {
		object[fieldName] = inputFields[fieldName].value;
	}
}

module.exports = Utils;
