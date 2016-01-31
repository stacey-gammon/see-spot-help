/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./home.jsx ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'
	
	var ShelterHomePage = __webpack_require__(/*! ./shelterhomepage */ 1);
	var ShelterSearchPage = __webpack_require__(/*! ./sheltersearchpage */ 2);
	
	var React = __webpack_require__(/*! react */ 3);
	
	var Router = ReactRouter.Router;
	var Route = ReactRouter.Route;
	var Link = ReactRouter.Link;
	
	var Home = React.createClass({displayName: "Home",
	    render: function() {
	        return (
	          React.createElement("div", null, 
	            React.createElement("ul", null, 
	              React.createElement("li", null, React.createElement(Link, {to: "shelterSearchPage"}, "Shelter Search Page")), 
	              React.createElement("li", null, React.createElement(Link, {to: "shelterHomePage"}, "Shelter Home Page"))
	            ), 
	            this.props.children
	          )
	      );
	    }
	});
	
	var routes = (
	  React.createElement(Router, {path: "/", component: Home}, 
	    React.createElement(Route, {path: "shelterSearchPage", component: ShelterSearchPage}), 
	    React.createElement(Route, {path: "shelterHomePage", component: ShelterHomePage})
	  )
	);
	
	ReactDOM.render(
	    React.createElement(Router, {routes: routes}),
	    document.getElementById('content')
	);

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./shelterhomepage.jsx ***!
  \*****************************/
/***/ function(module, exports) {

	/** @jsx React.DOM */
	var ShelterHomePage = React.createClass({displayName: "ShelterHomePage",
	    render: function() {
	        return (
	          React.createElement("div", null, 
	            "Shelter Home Page", 
	        this.props.children
	          )
	      );
	}
	});
	
	module.exports = ShelterHomePage;

/***/ },
/* 2 */
/*!*******************************!*\
  !*** ./sheltersearchpage.jsx ***!
  \*******************************/
/***/ function(module, exports) {

	/** @jsx React.DOM */
	var ShelterSearchPage = React.createClass({displayName: "ShelterSearchPage",
	    render: function() {
	        return (
	          React.createElement("div", null, 
	            "Shelter Search Page", 
	    this.props.children
	          )
	      );
	}
	});
	
	module.exports = ShelterSearchPage;

/***/ },
/* 3 */
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ function(module, exports) {

	module.exports = React;

/***/ }
/******/ ]);
//# sourceMappingURL=main.bundle.js.map