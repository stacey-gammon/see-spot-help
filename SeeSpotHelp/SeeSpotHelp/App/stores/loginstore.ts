"use strict";

import Volunteer from '../core/databaseobjects/volunteer';
import Group from '../core/databaseobjects/group';
import DatabaseObject from '../core/databaseobjects/databaseobject';
import DataServices from '../core/dataservices';
import BaseStore from './basestore';

enum ChangeEventEnum {
  ANY,
  LOGGED_IN
};

class LoginStore extends BaseStore {
  protected databaseObject: DatabaseObject = new Volunteer('', '');
  private userInBeta: boolean = false;
  private user: Volunteer = null;

  // Should probably be private but I'm setting it directly in the home class when listening to
  // the authentication call back.  Should be cleaned up.
  public authenticated: boolean = null;

  public userDownloading: boolean = false;
  public hasUser: boolean = null;
  public loggedOut: boolean = false;

  private resolveMe = null;
  private rejectMe = null;

  // Will be set to true once the FB sdk is loaded.
  public fbLoaded = false;

  constructor() {
    super();
    this.Init();
    DataServices.OnAuthStateChanged(this.onAuthStateChanged);
  }

  /**
   * Displays the signed-in user information in the UI or hides it and displays the
   * "Sign-In" button if the user isn't signed-in.
   */
  onAuthStateChanged(user) {
    if (user) {
      window.location.reloadPage();
    }
  }

  // See http://stackoverflow.com/questions/26390027/firebase-authwithoauthredirect-woes for
  // the bug we are trying to work around here.
  checkAuthenticatedWithRetries(retry) {
    console.log('checkAuthenticatedWithRetries: ' + retry);
    var authData = this.checkAuthenticated();
    if (authData) {
      sessionStorage.setItem('loginStoreAuthenticating', '');
      this.emitChange();
      return authData;
    }

    if (retry && retry >= 4) {
      console.log('checkAuthenticatedWithRetries: unsuccessful');
      // No auth data on the third try, give up and set user as logged out.
      sessionStorage.setItem('loginStoreAuthenticating', '');
      sessionStorage.setItem('user', '');
      this.user = null;
      this.emitChange();
      return null;
    }

    setTimeout(function() {
      if (!retry) retry = 0;
      retry += 1;
      this.checkAuthenticatedWithRetries(retry);
    }.bind(this), 500)
    return null;
  }

  checkAuthenticated() {
    var authData = DataServices.GetAuthData();
    if (authData) {
      this.authenticated = true;
      sessionStorage.setItem('loginStoreAuthenticating', '');
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      return authData;
    }
  }

  addLoggedInChangeListener(callback) {
    this.addChangeListener(callback, ChangeEventEnum.LOGGED_IN);
  }

  removedLoggedInChangeListener(callback) {
    this.removeChangeListener(callback, ChangeEventEnum.LOGGED_IN);
  }

  addChangeListener(callback, changeEvent? : ChangeEventEnum) {
    if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
    this.on(changeEvent.toString(), callback);
  }

  // @param {function} callback
  removeChangeListener(callback, changeEvent? : ChangeEventEnum) {
    if (!changeEvent) changeEvent = ChangeEventEnum.ANY;
    this.removeListener(changeEvent.toString(), callback);
  }

  isLoggedIn() {
    return this.authenticated && !!this.user;
  }

  authenticate(onSuccess, onError) {
    this.loggedOut = false;
    DataServices.LoginWithFacebookPopUp(this.onAuthenticated.bind(this, onSuccess), onError);
  }

  authenticateWithEmailPassword(email, password) : Promise<any> {
    this.loggedOut = false;
    return DataServices.LoginWithEmailAndPassword(email, password);
  }

  onAuthenticated(onSuccess) {
    var authData = this.checkAuthenticated();
    this.downloadUser(authData.uid);
    if (onSuccess) { onSuccess(); }
  }

  logout () {
    DataServices.LogOut();
    this.loggedOut = true;
    if (this.user) {
      DataServices.DetachListener(
        "users/" + this.user.id,
        this.onUserDownloaded.bind(this));
    }
    this.user = null;
    sessionStorage.clear();
    localStorage.clear();
  }


  onUserDownloaded(data) {
    var authData = this.checkAuthenticated() as any;

    // We are authenticated but no user exists for us, insert a new user.
    if (authData && data.val() == null) {
      this.user = new Volunteer(authData.displayName, authData.email);
      this.user.id = authData.uid;
      this.user.insert();
      this.hasUser = true;
    } else if (authData && data.val()){
      this.user = new Volunteer('', '').castObject(data.val());
      this.hasUser = true;
    } else {
      this.hasUser = false;
    }

    this.resolve();
    this.emitChange();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getUserFromStorage() {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (error) {
      console.log('Failed to parse user value ' + sessionStorage.getItem("user"));
      sessionStorage.setItem('user', '');
      return null;
    }
  }

  downloadAndAuthenticateUser() {
    // Don't auto-log the person in if they intentionally logged out.
    if (this.loggedOut) return;

    var authData = this.checkAuthenticated();
    if (authData) {
      this.downloadUser(authData.uid);
    }
    // else if (!this.authenticated && !sessionStorage.getItem('loginStoreAuthenticating')) {
    //   this.authenticate();
    // } else {
    //   this.reject();
    // }
  }

  downloadUser(userId) {
    if (this.userDownloading) return;
    this.userDownloading = true;
    DataServices.DownloadData(
      'users/' + userId,
      this.onUserDownloaded.bind(this),
      this.reject.bind(this));
  }

  getUser() {
    if (this.user && this.authenticated) return this.user;
    if (this.userDownloading || this.authenticated === false || this.hasUser === false) {
      return null;
    }
    this.downloadAndAuthenticateUser();
    return null;
  }

  clearPromiseFunctions () {
    this.resolveMe = null;
    this.rejectMe = null;
  }

  reject() {
    if (this.rejectMe) { this.rejectMe(); }
    this.clearPromiseFunctions();
    this.userDownloading = false;
  }

  resolve() {
    if (this.resolveMe) { this.resolveMe(this.user); }
    this.clearPromiseFunctions();
    this.userDownloading = false;
  }

  ensureUser() {
    return new Promise(function(resolve, reject) {
      if (this.user && this.authenticated) {
        resolve(this.user);
        return;
      }
      this.resolveMe = function (data) {
        resolve(data);
      };
      this.rejectMe = function (error) {
        reject(error);
      };
      return this.getUser();
    }.bind(this));
  }

  emitChange(changeEvent? : ChangeEventEnum) {
    this.emit(ChangeEventEnum.ANY.toString());
    if (changeEvent) {
      this.emit(changeEvent.toString());
    }
  }

  handleAction(action) {
    switch (action.type) {
      case ActionConstants.LOGIN_USER_SUCCESS:
        this.user = action.user;
        sessionStorage.setItem("user", JSON.stringify(this.user));
        this.emitChange(ChangeEventEnum.LOGGED_IN);
        break;

      case ActionConstants.LOGIN_USER_ERROR:
        this.emitChange();
        break;

      case ActionConstants.LOGOUT_USER:
        console.log("LoginStore:handleAction:LOGOUT_USER");
        this.emitChange();
        break;

      default:
        break;
    };
  }
};

export default new LoginStore();
