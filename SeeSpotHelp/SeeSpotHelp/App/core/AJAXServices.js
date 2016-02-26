// A helpful class filled with functions for validating various
// input fields.
var AJAXServices = function (successCallback, failureCallback) {
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;

    this.firebaseURL = "https://shining-torch-1432.firebaseio.com/";
};

AJAXServices.useFirebase = true;
AJAXServices.firebaseURL = "https://shining-torch-1432.firebaseio.com/";

AJAXServices.startStringSearch = function (path, child, searchText, onSuccess) {
    console.log("AJAXServices::startSearch");

    var ref = new Firebase(this.firebaseURL + "/" + path);
    ref.orderByChild(child).startAt(searchText).endAt(searchText + "\uf8ff").on("value",
        function (snapshot) {
            onSuccess(snapshot.val());
        });
};

AJAXServices.prototype.GetFirebaseData = function(path) {
    console.log("AJAXServices:GetFirebaseData for url " + path);
    var ref = new Firebase(this.firebaseURL + "/" + path);
    var outer = this;
    ref.on("value", function (snapshot) {
        console.log("AJAXServices.GetFirebaseData: Successfully called " + path);
        console.log(snapshot.val());
        outer.onSuccess(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        outer.onFailure(errorObject);
    });
};

AJAXServices.SetFirebaseData = function(path, value) {
    console.log("AJAXServices:SetFirebaseData");
    var ref = new Firebase(this.firebaseURL + "/" + path);
    ref.set(value);
};

AJAXServices.PushFirebaseData = function (path, value) {
    console.log("AJAXServices:PushFirebaseData with value ");
    console.log(value);
    var ref = new Firebase(this.firebaseURL + "/" + path);
    var newPath = ref.push(value);
    value.id = newPath.key();
    return value;
};

AJAXServices.UpdateFirebaseData = function (path, value) {
    console.log("AJAXServices:UpdateFirebaseData");
    var ref = new Firebase(this.firebaseURL + "/" + path);
    var newPath = ref.update(value);
    return value;
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

AJAXServices.prototype.callFileUploadService = function (callbackURI,
                                                         methodName,
                                                         file) {
    var fd = new FormData();
    // console.log("AJAXServices:callFileUploadService: with file");
   // console.log(file);
    fd.append('file', file);

    console.log("AJAXServices::CallFileUploadService");
    $.ajax({
        type: 'POST',
        contentType: false,
        processData: false,
        data: fd,
        url: callbackURI + '/' + methodName
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
    console.log("AJAXServices::OnFailure, response:");
    console.log(response);
    this.failureCallback(response);
};

module.exports = AJAXServices;
