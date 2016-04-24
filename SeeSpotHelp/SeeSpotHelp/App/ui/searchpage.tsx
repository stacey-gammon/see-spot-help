'use strict';

var React = require("react");
var SearchBox = require('./searchbox');
import InfoBar from './shared/infobar';

var SearchPage = React.createClass({
	render: function() {
		return (
			<div className='page'>
				<InfoBar noTabs='true'><h1>Search</h1></InfoBar>
				<SearchBox />
			</div>
		);
	}
});

module.exports = SearchPage;
