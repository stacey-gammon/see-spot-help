// A helpful class filled with functions for validating various
// input fields.
var AJAXServices = function (successCallback, failureCallback) {
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
};

//Used to send a JSON based Web Service Request to the server
///*
//*  A JSON web service MUST have the <ScriptService> attribute, and any methods called must have a <ScriptMethod> attribute.
//*/
//Note: The __type property must be the first JSON property of an object to ensure proper serialization/deserialization
AJAXServices.prototype.CallJSONService = function (callbackURI,
                                                   methodName,
                                                   params) {
    console.log("AJAXServices::CallJSONService");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: callbackURI + '/' + methodName,
        processData: false,
        data: JSON.stringify($(params)[0]) // params need to be in a single json object.  Arrays are right out.
    }).
        done(function (response) {
            this.onSuccess(response);
        }.bind(this)).
        fail(function (response) {
            this.onFailure(response);
        }.bind(this));   // response data contains the javascript object parsed from the JSON data.
};

AJAXServices.prototype.onSuccess = function (response) {
    console.log("AJAXServices::OnSuccess");
    this.successCallback(response);
};

AJAXServices.prototype.onFailure = function (response) {
    console.log("AJAXServices::OnFailure");
    this.failureCallback(response);
};

module.exports = AJAXServices;
