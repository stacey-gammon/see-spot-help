// A helpful class filled with static functions for validating various
// input fields.
var AJAXServices = function () { };

//Used to send a JSON based Web Service Request to the server
///*
//*  A JSON web service MUST have the <ScriptService> attribute, and any methods called must have a <ScriptMethod> attribute.
//*/
//Note: The __type property must be the first JSON property of an object to ensure proper serialization/deserialization
AJAXServices.CallJSONService = function (callbackURI,
                                         methodName,
                                         params,
                                         ReceiveServerData,
                                         ProcessError) {
    console.log("AJAXServices::CallJSONService");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: callbackURI + '/' + methodName,
        processData: false,
        data: JSON.stringify($(params)[0]) // params need to be in a single json object.  Arrays are right out.
    }).
        done(ReceiveServerData).
        fail(ProcessError);   // response data contains the javascript object parsed from the JSON data.
};

module.exports = AJAXServices;
