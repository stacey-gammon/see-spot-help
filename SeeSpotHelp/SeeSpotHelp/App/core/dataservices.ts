
var Firebase = require('firebase');

// Initialize Firebase
import initFirebase from './firebaseconfig';
initFirebase();

export default class DataServices {
  private static database = Firebase.database();

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

  public static SignUpWithEmailAndPassword(email: string, password: string) : Promise<any> {
    return Firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  public static LoginWithEmailAndPassword(email: string, password: string) : Promise<any> {
    return Firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public static ResetPassword(email: string) : Promise<any> {
    return Firebase.auth().sendPasswordResetEmail(email);
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
      if (onSuccess) { onSuccess(); }
    }).catch(function(error) {
      if (onError) { onError(error); }
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

  public static SetFirebaseData(path, value) : Promise<any> {
    var ref = this.database.ref("/" + path);
    return ref.set(value);
  };

  public static RemoveFirebaseData(path, callback?) : Promise<any> {
    console.log('DataServices.RemovingFirebaseData at ' + path);
    var ref = this.database.ref('/' + path);
    return ref.remove(callback);
  }

  public static PushFirebaseData(path, value) {
    var ref = this.database.ref('/' + path);
    return ref.push(value);
  }

  public static UpdateMultiple(updates) : Promise<any> {
    var ref = this.database.ref();
    return ref.update(updates);
  }

  public static DeleteMultiple(deletes) : Promise<any> {
    var ref = this.database.ref();
    return ref.update(deletes);
  }

  public static UploadPhoto(thumbBlob, listBlob, fullBlob, fileName, userId) {
    // Start the pic file upload to Firebase Storage.
    let picRef = Firebase.storage().ref(`${userId}/full/${Date.now()}/${fileName}`);
    let metadata = {
      contentType: fullBlob.type
    };
    var picUploadTask = picRef.put(fullBlob, metadata);
    let picCompleter = $.Deferred();
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
    let thumbCompleter = $.Deferred();
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
    let listCompleter = $.Deferred();
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
