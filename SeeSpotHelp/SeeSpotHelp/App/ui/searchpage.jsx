"use strict";

var React = require("react");
var SearchBox = require("./searchbox");

var SearchPage = React.createClass({
	render: function() {
		return (
			<SearchBox />
		);
	}
});

module.exports = SearchPage;
