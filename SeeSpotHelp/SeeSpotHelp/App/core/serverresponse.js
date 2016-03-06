"use strict"

// A place to store a response from the server.

// TODO: Should we store returned js objects (e.g. an inserted
// VolunteerGroup) inside the ServerResponse, or pass it separately
// as an additional parameter to callback functions?  For now,
// goind with the latter.

var ServerResponse = function (errorMessage) {
	this.hasError = !!errorMessage;
	this.errorMessage = errorMessage;
};

module.exports = ServerResponse;
