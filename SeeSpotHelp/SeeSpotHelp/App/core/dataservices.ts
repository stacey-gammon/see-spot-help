
var Firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmUDL3vRmv7RsLJIe9oMKLqHhmvuOmBCc",
  authDomain: "shining-torch-1432.firebaseapp.com",
  databaseURL: "https://shining-torch-1432.firebaseio.com",
  storageBucket: "shining-torch-1432.appspot.com",
};
Firebase.initializeApp(config);

// A helpful class filled with functions for validating various
// input fields.
export default class DataServices {
  public static FirebaseURL = "https://shining-torch-1432.firebaseio.com/";

  public firebaseURL: string = DataServices.FirebaseURL;
  private successCallback;
  private failureCallback;
  private static database = Firebase.database();

  // TODO: make this class only contain static functions, it's easier.
  constructor(successCallback, failureCallback) {
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
  }

  public static GetNewPushKey(path): string {
    var ref = this.database.ref();
    var newPostRef = ref.child(path).push();
    return newPostRef.key;
  }

  public static StartStringSearch(path, child, searchText, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).startAt(searchText).endAt(searchText + "\uf8ff").on("value",
      function (snapshot) {
        onSuccess(snapshot.val());
      });
  }

  public static LogOut() {
    Firebase.auth().signOut();
  }

  public static OnAuthStateChanged(callback) {
    Firebase.auth().onAuthStateChanged(callback);
  }

  public static LoginWithFacebookPopUp(onSuccess, onError) {
    var ref = this.database.ref();
    var provider = new Firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    Firebase.auth().signInWithPopup(provider).then(function(result) {
      // The firebase.User instance:
      var user = result.user;
      // The Facebook firebase.auth.AuthCredential containing the Facebook
      // access token:
      var credential = result.credential;
      onSuccess();
    }, function(error) {
      onError();
      console.log('ERROR: ', error);
    });
  }

  public static GetAuthData() {
    return Firebase.auth().currentUser;
  }

  public static OnMatchingChildRemoved(path, child, value, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).equalTo(value).on("child_removed", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static OnMatchingChildAdded(path, child, value, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static OnMatchingChildChanged(path, child, value, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).equalTo(value).on("child_changed", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static OnChildRemoved(path, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.on("child_removed", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static OnChildAdded(path, onSuccess, timestamp) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild('timestamp').startAt(timestamp).on("child_added", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static OnChildChanged(path, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.on("child_changed", function (snapshot) {
      onSuccess(snapshot);
    });
  }

  public static GetChildData(path, child, value, onSuccess, listen) {
    var ref = this.database.ref("/" + path);
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
    var ref = this.database.ref("/" + path);
    ref.off("value", callback);
  }

  public static DownloadData(path, onSuccess, onError?) {
    var ref = this.database.ref("/" + path);
    ref.on("value", function (snapshot) {
        onSuccess(snapshot);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        if (onError) onError(errorObject);
      }
    );
  }

  public static DownloadDataOnce(path, onSuccess, onError?) {
    var ref = this.database.ref("/" + path);
    ref.once("value", function (snapshot) {
        onSuccess(snapshot);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        if (onError) onError(errorObject);
      }
    );
  }

  public static SetFirebaseData(path, value) {
    var ref = this.database.ref("/" + path);
    ref.set(value);
  };

  public static RemoveFirebaseData(path, callback?) {
    console.log('DataServices.RemovingFirebaseData at ' + path);
    var ref = this.database.ref('/' + path);
    ref.remove(callback);
  }

  public static PushFirebaseData(path, value) {
    var ref = this.database.ref('/' + path);
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

  public static UpdateMultiple(updates) : Promise<any> {
    var ref = this.database.ref();
    return ref.update(updates);
  }

  public static UpdateFirebaseData(path, value) {
    var authref = this.database.ref();
    var authData = authref.getAuth();
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
      console.log("User is logged out");
    }

    var ref = new Firebase("/" + path);
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

  public static UploadPhoto(thumbBlob, listBlob, fullBlob, fileName, userId) {
    // Start the pic file upload to Firebase Storage.
    let picRef = Firebase.storage().ref(`${userId}/full/${Date.now()}/${fileName}`);
    let metadata = {
      contentType: fullBlob.type
    };
    var picUploadTask = picRef.put(fullBlob, metadata);
    let picCompleter = new $.Deferred();
    picUploadTask.on('state_changed', null, error => {
      picCompleter.reject(error);
      console.error('Error while uploading new pic', error);
    }, () => {
      console.log('New pic uploaded. Size:', picUploadTask.snapshot.totalBytes, 'bytes.');
      let url = picUploadTask.snapshot.metadata.downloadURLs[0];
      console.log('File available at', url);
      picCompleter.resolve(url);
    });

    var thumbUrl = `${userId}/thumb/${Date.now()}/${fileName}`;
    // Start the thumb file upload to Firebase Storage.
    let thumbRef = Firebase.storage().ref(thumbUrl);
    var tumbUploadTask = thumbRef.put(thumbBlob, metadata);
    let thumbCompleter = new $.Deferred();
    tumbUploadTask.on('state_changed', null, error => {
      thumbCompleter.reject(error);
      console.error('Error while uploading new thumb', error);
    }, () => {
      console.log('New thumb uploaded. Size:', tumbUploadTask.snapshot.totalBytes, 'bytes.');
      let url = tumbUploadTask.snapshot.metadata.downloadURLs[0];
      console.log('File available at', url);
      thumbCompleter.resolve(url);
    });

    var listUrl = `${userId}/list/${Date.now()}/${fileName}`;
    let listRef = Firebase.storage().ref(listUrl);
    var listUploadTask = listRef.put(listBlob, metadata);
    let listCompleter = new $.Deferred();
    listUploadTask.on('state_changed', null, error => {
      listCompleter.reject(error);
      console.error('Error while uploading new list', error);
    }, () => {
      console.log('New list uploaded. Size:', listUploadTask.snapshot.totalBytes, 'bytes.');
      let url = listUploadTask.snapshot.metadata.downloadURLs[0];
      console.log('File available at', url);
      listCompleter.resolve(url);
    });

    return Promise.all([thumbCompleter.promise(), listCompleter.promise(), picCompleter.promise()]);
  }
}
