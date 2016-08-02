
var Firebase = require('firebase');
//Firebase.database.enableLogging(true);


import $ = require('jquery');
// Initialize Firebase
import initFirebase from './firebaseconfig';
initFirebase();

const MaxNetworkRetries : number = 3;

/**
 * Controls access to the firebase database end point, as well as image storage.
 */
export default class DataServices {
  private static database = Firebase.database();
  private static addListeners: Array<string> = [];
  private static changeListeners: Array<string> = [];
  private static removeListeners: Array<string> = [];
  private static networkErrorRetries: number = 0;

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

  public static TurnOffListeners(listeners) {
      for (let i = 0; i < listeners.length; i++) {
        this.database.ref("/" + listeners[i]).off();
      }
  }

  public static LogOut() : Promise<any> {
    this.TurnOffListeners(this.addListeners);
    this.TurnOffListeners(this.removeListeners);
    this.TurnOffListeners(this.changeListeners);

    this.addListeners = [];
    this.removeListeners = [];
    this.changeListeners = [];

    return Firebase.auth().signOut();
  }

  public static OnAuthStateChanged(callback) {
    Firebase.auth().onAuthStateChanged(callback);
  }

  public static SignUpWithEmailAndPassword(email: string, password: string) : Promise<any> {
    return Firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  public static LoginWithEmailAndPassword(email: string, password: string) : Promise<any> {
    console.log('DataServices:LoginWithEmailAndPassword: Logging in as ' + email + ' with pw ' + password);
    let signInPromise = Firebase.auth().signInWithEmailAndPassword(email, password);
    console.log('Firebase sign in promise: ', signInPromise);
    return this.WrapInCatch(
        signInPromise,
        this.LoginWithEmailAndPassword.bind(this, email, password));
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
      console.log('OnMatchingChildRemoved: child_removed at ' + path);
      onSuccess(snapshot);
    });
  }

  public static OnMatchingChildAdded(path, child, value, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
      console.log('child_added at ' + path);
      onSuccess(snapshot);
    });
  }

  public static OnMatchingChildChanged(path, child, value, onSuccess) {
    var ref = this.database.ref("/" + path);
    ref.orderByChild(child).equalTo(value).on("child_changed", function (snapshot) {
      console.log('child_changed at ' + path);
      onSuccess(snapshot);
    });
  }

  public static OnChildRemoved(path, onSuccess) {
    console.log('DataServices:OnChildRemoved: ' + path);
    if (this.removeListeners.indexOf(path) >= 0) return;
    this.removeListeners.push(path);
    var ref = this.database.ref("/" + path);
    ref.on("child_removed", function (snapshot) {
      console.log('child_removed at ' + path);
      onSuccess(snapshot);
    });
  }

  public static OnChildAdded(path: string, onSuccess: (any) => void, lastTimestamp? : number) {
    if (this.addListeners.indexOf(path) >= 0) return;
    this.addListeners.push(path);
    var ref = this.database.ref("/" + path).orderByChild('timestamp');
    if (lastTimestamp) {
      ref = ref.startAt(lastTimestamp);
    }
    ref.on("child_added", function (snapshot) {
      console.log('child_added at ' + path);
      onSuccess(snapshot);
    });
  }

  public static OnChildChanged(path, onSuccess) {
    if (this.changeListeners.indexOf(path) >= 0) return;
    this.changeListeners.push(path);
    var ref = this.database.ref("/" + path);
    ref.on("child_changed", function (snapshot) {
      console.log('child_changed at ' + path);
      onSuccess(snapshot);
    });
  }

  public static GetChildData(path, child, value, onSuccess, listen) {
    var ref = this.database.ref("/" + path);
    if (listen) {
      ref.orderByChild(child).equalTo(value).on("child_added", function (snapshot) {
        console.log('child_added at ' + path);
        onSuccess(snapshot);
      });
    } else {
      ref.orderByChild(child).equalTo(value).once("value", function (snapshot) {
        console.log('value once at ' + path);
        onSuccess(snapshot);
      });
    }
  }

  public static DetachListener(path, callback) {
    var ref = this.database.ref("/" + path);
    ref.off("value", callback);
  }

  public static MaybeRetry(error, originalCall: () => Promise<any>) : Promise<any> {
    if (error.code == 'auth/network-request-failed' &&
        this.networkErrorRetries < MaxNetworkRetries) {
      console.log('Caught network error, retry #' + this.networkErrorRetries);
      this.networkErrorRetries++;
      return originalCall();
    } else {
      throw error;
    }
  }

  public static DownloadData(path, callback) {
    console.log('DownloadData at ' + path);
    this.database.ref("/" + path).on("value", callback);
  }

  public static DownloadDataOnce(path, lengthLimit?, id?) : Promise<any> {
    var ref = this.database.ref("/" + path);

    if (lengthLimit && id) {
      ref = ref.orderByKey().endAt(id).limitToLast(lengthLimit);
    } else if (lengthLimit) {
      ref = ref.orderByKey().limitToLast(lengthLimit);
    }

    return this.WrapInCatch(ref.once('value'),
                            this.DownloadDataOnce.bind(this, path, lengthLimit, id));
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

  public static PushFirebaseData(path, value) : Promise<any> {
    var ref = this.database.ref('/' + path);
    return ref.push(value);
  }

  public static WrapInCatch(promise: Promise<any>, originalCall) : Promise<any> {
    console.log('WrapInCatch: ', promise);
    return promise.then((result) => {
      console.log('promise succeeded, reseting network retries, returning ', result);
      this.networkErrorRetries = 0;
      return result;
    })
    .catch((error) => {
      console.log('Error caught: ', error);
      return this.MaybeRetry(error, originalCall);
    });
  }

  public static UpdateMultiple(updates: {}) : Promise<any> {
    var ref = this.database.ref();
    return this.WrapInCatch(ref.update(updates), this.UpdateMultiple.bind(this, updates));
  }

  public static DeleteMultiple(deletes: {}) : Promise<any> {
    console.log('Dataservices:DeleteMultiple: on deletes ', deletes);
    var ref = this.database.ref();
    return this.WrapInCatch(ref.update(deletes), this.DeleteMultiple.bind(this, deletes));
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
