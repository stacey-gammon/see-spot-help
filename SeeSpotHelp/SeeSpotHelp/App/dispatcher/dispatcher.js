"use strict"

var Dispatcher = require("flux").Dispatcher;

class AppDispatcher extends Dispatcher {
    constructor() {
        super();
        console.log("AppDispatcher:constructor");
    }
};

module.exports = new AppDispatcher();
