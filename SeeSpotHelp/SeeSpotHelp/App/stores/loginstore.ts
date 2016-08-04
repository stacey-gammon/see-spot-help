"use strict";

import Volunteer from '../core/databaseobjects/volunteer';
import Group from '../core/databaseobjects/group';
import DatabaseObject from '../core/databaseobjects/databaseobject';
import DataServices from '../core/dataservices';
import PermissionsStore from './permissionsstore';
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
  }

  checkAuthenticated() {
    var authData = DataServices.GetAuthData();
    if (authData) {
      this.authenticated = true;
      sessionStorage.setItem('loginStoreAuthenticating', '');
      console.log('User ' + authData.uid + ' is logged in');
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
    console.log('authenticateWithEmailPassword(' + email + ',' + password + ')');
    this.loggedOut = false;
    return DataServices.LoginWithEmailAndPassword(email, password)
        .then((data) => {
          console.log('Completed login with ' + email + ' and ' + password + ' with data ', data);
          this.authenticated = true;
          return data;
        });
  }

  signUpWithEmailAndPassword(name, email, password) : Promise<any> {
    return this.logout()
        .then(() => {
          this.loggedOut = false;
          return DataServices.SignUpWithEmailAndPassword(email, password);
        })
        .then(() => {
          return this.ensureUser();
        })
        .then(() => {
          this.getUser().name = name;
          return this.getUser().update();
        });
  }

  onAuthenticated(onSuccess) {
    console.log('onAuthenticated');
    var authData = this.checkAuthenticated();
    this.downloadUser(authData.uid);
    if (onSuccess) { onSuccess(); }
  }

  logout() : Promise<any> {
    console.log('logout');
    return DataServices.LogOut().then(() => {
      this.loggedOut = true;
      if (this.user) {
        DataServices.DetachListener(
            "users/" + this.user.id,
            this.onUserDownloaded.bind(this));
      }
      this.authenticated = false;
      this.user = null;
      sessionStorage.clear();
      localStorage.clear();
      console.log('auth after logout: ', DataServices.GetAuthData());
    });
  }

  onUserDownloaded(data) {
    console.log('onUserDownloaded');
    var authData = this.checkAuthenticated() as any;
    console.log('User downloaded with data ', data);
    // We are authenticated but no user exists for us, insert a new user.
    if (authData && data.val() == null) {
      this.user = new Volunteer(authData.displayName, authData.email);
      this.user.id = authData.uid;
      this.user.insert();
      this.hasUser = true;
    } else if (authData && data.val()) {
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

  downloadAndAuthenticateUser() : Promise<any> {
    console.log('downloadAndAuthenticateUser');
    // Don't auto-log the person in if they intentionally logged out.
    if (this.loggedOut) return Promise.resolve();

    var authData = this.checkAuthenticated();
    if (authData) {
      return this.downloadUser(authData.uid);
    }
  }

  downloadUser(userId) : Promise<any>{
    if (this.userDownloading) return;
    console.log('Downloading user ' + userId);
    this.userDownloading = true;
    return DataServices.DownloadDataOnce('users/' + userId)
        .then((data) => {
          this.onUserDownloaded(data);
        }, this.reject.bind(this));
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

  reject(error) {
    if (this.rejectMe) { this.rejectMe(error); }
    this.clearPromiseFunctions();
    this.userDownloading = false;
  }

  resolve() {
    if (this.resolveMe) { this.resolveMe(this.user); }
    this.clearPromiseFunctions();
    this.userDownloading = false;
  }

  ensureUser() : Promise<Volunteer> {
    if (this.user && this.authenticated) {
      return Promise.resolve(this.user);
    }
    return this.downloadAndAuthenticateUser();
  }

  emitChange(changeEvent? : ChangeEventEnum) {
    this.emit(ChangeEventEnum.ANY.toString());
    if (changeEvent) {
      this.emit(changeEvent.toString());
    }
  }
};

export default new LoginStore();
