
var StringUtils = function () { }

StringUtils.MakeSearchable = function (field) {
	return field.toLowerCase().replace(/\W/g, '');
}

module.exports = StringUtils;
