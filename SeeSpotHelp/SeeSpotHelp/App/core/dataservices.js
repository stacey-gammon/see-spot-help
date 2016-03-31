// A helpful class filled with functions for validating various
// input fields.
var DataServices = function (successCallback, failureCallback) {
	this.successCallback = successCallback;
	this.failureCallback = failureCallback;

	this.firebaseURL = "https://shining-torch-1432.firebaseio.com/";
};

DataServices.useFirebase = true;
DataServices.firebaseURL = "https://shining-torch-1432.firebaseio.com/";

DataServices.startStringSearch = function (path, child, searchText, onSuccess) {
	console.log("DataServices::startSearch");

	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.orderByChild(child).startAt(searchText).endAt(searchText + "\uf8ff").on("value",
		function (snapshot) {
			onSuccess(snapshot.val());
		});
};

DataServices.OnMatchingChildRemoved = function(path, child, value, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.orderByChild(child).equalTo(value).on("child_removed", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.OnMatchingChildAdded = function(path, child, value, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.OnMatchingChildChanged = function(path, child, value, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.orderByChild(child).equalTo(value).on("child_changed", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.OnChildRemoved = function(path, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.on("child_removed", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.OnChildAdded = function(path, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.on("child_added", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.OnChildChanged = function(path, onSuccess) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.on("child_changed", function (snapshot) {
		onSuccess(snapshot);
	});
}

DataServices.GetChildData = function(path, child, value, onSuccess, listen) {
	console.log("DataServices:GetFirebaseData for url " + path);
	var ref = new Firebase(this.firebaseURL + "/" + path);
	if (listen) {
		ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
			onSuccess(snapshot);
		});
	} else {
		ref.orderByChild(child).equalTo(value).once("value", function (snapshot) {
			onSuccess(snapshot);
		});
	}
};

DataServices.DetachListener = function(path, callback) {
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.off("value", callback);
}

DataServices.prototype.GetFirebaseData = function(path, listen) {
	console.log("DataServices:GetFirebaseData for url " + path);
	var ref = new Firebase(this.firebaseURL + "/" + path);
	var outer = this;
	if (listen) {
		ref.on("value", function (snapshot) {
			outer.onSuccess(snapshot.val());
		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
			outer.onFailure(errorObject);
		});
	} else {
		ref.once("value", function (snapshot) {
			outer.onSuccess(snapshot.val());
		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
			outer.onFailure(errorObject);
		});
	}
};

DataServices.SetFirebaseData = function(path, value) {
	console.log("DataServices:SetFirebaseData");
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.set(value);
};

DataServices.RemoveFirebaseData = function (path, callback) {
	console.log("DataServices:RemoveFirebaseData");
	var ref = new Firebase(this.firebaseURL + "/" + path);
	ref.remove(callback);
};

DataServices.PushFirebaseData = function (path, value) {
	console.log("DataServices:PushFirebaseData with value ");
	console.log(value);
	var ref = new Firebase(this.firebaseURL + "/" + path);
	var newPath = {};
	var onComplete = function (err) {
		if (err) {
			console.log("error!: ", err);
		} else {
			DataServices.UpdateFirebaseData(path + "/" + newPath.key(), {id: newPath.key()});
		}
	}
	var newPath = ref.push(value, onComplete);
	value.id = newPath.key();
	return value;
};

DataServices.UpdateFirebaseData = function (path, value) {
	console.log("DataServices:UpdateFirebaseData");
	var ref = new Firebase(this.firebaseURL + "/" + path);
	var newPath = ref.update(value);
	return value;
};

//Used to send a JSON based Web Service Request to the server
///*
//*  A JSON web service MUST have the <ScriptService> attribute, and any methods called must have a <ScriptMethod> attribute.
//*/
//Note: The __type property must be the first JSON property of an object to ensure proper serialization/deserialization
DataServices.prototype.CallJSONService = function (callbackURI,
												   methodName,
												   params) {
	console.log("DataServices::CallJSONService");
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

DataServices.prototype.callFileUploadService = function (callbackURI,
														 methodName,
														 file) {
	var fd = new FormData();
	// console.log("DataServices:callFileUploadService: with file");
   // console.log(file);
	fd.append('file', file);

	console.log("DataServices::CallFileUploadService");
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

DataServices.prototype.onSuccess = function (response) {
	console.log("DataServices::OnSuccess");
	this.successCallback(response);
};

DataServices.prototype.onFailure = function (response) {
	console.log("DataServices::OnFailure, response:");
	console.log(response);
	this.failureCallback(response);
};

module.exports = DataServices;
