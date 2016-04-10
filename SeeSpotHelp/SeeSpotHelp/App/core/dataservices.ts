
import Firebase = require('firebase');

// A helpful class filled with functions for validating various
// input fields.
export default class DataServices {
	public static FirebaseURL = "https://shining-torch-1432.firebaseio.com/";

	public firebaseURL: string = DataServices.FirebaseURL;
	private successCallback;
	private failureCallback;

	// TODO: make this class only contain static functions, it's easier.
	constructor(successCallback, failureCallback) {
		this.successCallback = successCallback;
		this.failureCallback = failureCallback;
	}

	public static GetNewPushKey(path): string {
		var ref = new Firebase(this.FirebaseURL);
		var newPostRef = ref.child(path).push();
		return newPostRef.key();
	}

	public static StartStringSearch(path, child, searchText, onSuccess) {
		var ref = new Firebase(this.FirebaseURL + "/" + path);
		ref.orderByChild(child).startAt(searchText).endAt(searchText + "\uf8ff").on("value",
			function (snapshot) {
				onSuccess(snapshot.val());
			});
	}

	public static AuthenticateWithEmailAndPassword(email, password, onSuccess, onFailure) {
		var ref = new Firebase(DataServices.FirebaseURL);
		ref.authWithPassword({
		  email    : email,
		  password : password
	  }, function(error, authData) {
		  if (error) {
			console.log("Error creating user:", error);
			onFailure();
		  } else {
			onSuccess(authData);
		  }
		});
	}

	public static LogOut() {
		var ref = new Firebase(DataServices.FirebaseURL);
		ref.unauth();
	}

	public static LoginWithFacebookRedirect() {
		var ref = new Firebase(DataServices.FirebaseURL);
		ref.authWithOAuthRedirect(
			"facebook",
			// This function does nothing because of the redirect, it will never be called.
			function (error) {},
			{ scope: "email" }
		);
	}

	public static GetAuthData() {
		var authref = new Firebase(DataServices.FirebaseURL);
		return authref.getAuth();
	}

	public static OnMatchingChildRemoved(path, child, value, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.orderByChild(child).equalTo(value).on("child_removed", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static OnMatchingChildAdded(path, child, value, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static OnMatchingChildChanged(path, child, value, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.orderByChild(child).equalTo(value).on("child_changed", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static OnChildRemoved(path, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.on("child_removed", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static OnChildAdded(path, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.on("child_added", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static OnChildChanged(path, onSuccess) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.on("child_changed", function (snapshot) {
			onSuccess(snapshot);
		});
	}

	public static GetChildData(path, child, value, onSuccess, listen) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		if (listen) {
			ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
				onSuccess(snapshot);
			});
		} else {
			ref.orderByChild(child).equalTo(value).once("value", function (snapshot) {
				onSuccess(snapshot);
			});
		}
	}

	public static DetachListener(path, callback) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.off("value", callback);
	}

	public static DownloadData(path, onSuccess, onError?) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.on("value", function (snapshot) {
				onSuccess(snapshot);
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				if (onError) onError(errorObject);
			}
		);
	}

	public GetFirebaseData(path, listen) {
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
	}

	public static SetFirebaseData(path, value) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.set(value);
	};

	public static RemoveFirebaseData(path, callback?) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		ref.remove(callback);
	}

	public static PushFirebaseData(path, value) {
		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		var newPath = { 'key': null };
		var onComplete = function (err) {
			console.log('pushing new data completed with ', err);
			if (err) {
				console.log("error!: ", err);
			} else {
				console.log('updating ' + path + "/" + newPath.key() + ' with id val');
				DataServices.UpdateFirebaseData(path + "/" + newPath.key(), {id: newPath.key()});
			}
		}
		// Override the default typing, this should work correctly.
		var newPath = ref.push(value, onComplete) as { 'key': any };
		value.id = newPath.key();
		return value;
	}

	public static UpdateMultiple(updates) {
		var ref = new Firebase(DataServices.FirebaseURL);
		ref.update(updates);
	}

	public static UpdateFirebaseData(path, value) {
		var authref = new Firebase(DataServices.FirebaseURL);
		var authData = authref.getAuth();
		if (authData) {
		  console.log("User " + authData.uid + " is logged in with " + authData.provider);
		} else {
		  console.log("User is logged out");
		}

		var ref = new Firebase(DataServices.FirebaseURL + "/" + path);
		var onComplete = function (err) {

			console.log('UpdateFirebaseData to set ' + path + ' equal to ' + value + ' completed with ', err);
		}
		var newPath = ref.update(value, onComplete);
		return value;
	}

	public onSuccess = function (response) {
		this.successCallback(response);
	}

	public onFailure = function (response) {
		console.log("DataServices::OnFailure, response:");
		console.log(response);
		if (this.failureCallback) {
			this.failureCallback(response);
		}
	}
}
