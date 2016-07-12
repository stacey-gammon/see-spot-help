"use strict"

var ServerResponse = require("../serverresponse");
import DataServices from '../dataservices';
import Color from './colors';
import Animal from './animal';
import Photo from './photo';
import Schedule from './schedule';
import Activity from './activity';
import Permission from './permission';
import Comment from './comment';

import DatabaseObject from './databaseobject';
import { Status } from './databaseobject';

import LoginStore from '../../stores/loginstore';

// A volunteer group represents a group of volunteers at a given
// shelter.  The most common scenario will be a one to mapping of
// shelter to volunteer group, though it is possible for there to
// be multiple groups linked to a single shelter. An example of this
// is if there are two separate volunteer groups for each animal
// type - i.e. cat volunteers and dog volunteers. Another scenario
// is if a random person creates a volunteer group for a shelter, then
// stops using the app.  It will just sit there unused and the real
// volunteers will have to create a separate group.

// Creates a new volunteer group with the given fields.
// @param name {string} The group name.
// @param shelter {string} The shelter name.
// @param address {string} The street address of the shelter.
// @param city {string} The city of the sheleter.
// @param state {string} The state the shelter belongs in.
// @param zipCode {string} The zip code the shelter resides in.
// @param id {string} the id of the group.
export default class Group extends DatabaseObject {
  public name: string = '';
  public shelter: string = '';
  public address: string = '';
  public city: string = '';
  public state: string = '';
  public zipCode: string = '';
  public photoId: string = '';

  constructor() {
    super();
  }

  createInstance() { return new Group(); }

  public static FromJSON(json) {
    var group = Group.castObject(json);
    return group;
  }

  RemoveAnimalColor(color) {
    //this.availableAnimalColors.RemoveColor(color);
  }

  RemoveVolunteerColor(color) {
    //this.availableMemberColors.RemoveColor(color);
  }

  GetColorForVolunteer() {
    return Color.GetAvailableColor();
    //return this.availableMemberColors.GetAvailableColor();
  }

  GetColorForAnimal() {
    return Color.GetAvailableColor();
    //return this.availableAnimalColors.GetAvailableColor();
  }

  // Casts the given obj as a volunteer group.  Careful -
  // obj must have originally been a type of Group
  // for this to work as expected.  Helpful when passing around
  // objects via React state and props.  Can use this to restore the
  // original class, complete with functions, from an object with only
  // properties.
  public static castObject(obj) {
    var group = new Group();
    group = Object.assign(group, obj);
    return group;
  }

  copyFieldsFrom(other) {
    for (var prop in other) {
      this[prop] = other[prop];
    }
  }

  public static PermissionsEnum = Object.freeze(
    {
      MEMBER: 0,
      NONMEMBER: 1,
      ADMIN: 2,
      PENDINGMEMBERSHIP: 3,
      MEMBERSHIPDENIED: 4
    }
  )

  isArchived() {
    return this.status == Status.ARCHIVED;
  }

  delete() : Promise<any> {
    this.status = Status.ARCHIVED;
    return this.update();
  }

  // Attempts to insert the current instance into the database as
  // a new volunteer group.
  // @param callback {Function(Group, ServerResponse) }
  //	 callback is expected to take as a first argument the potentially
  //	 inserted volunteer group (null on failure) and a server
  //	 response to hold error and success information.
  insert() : Promise<DatabaseObject> {
    var inserts = this.getInserts();
    var permission = Permission.CreateAdminPermission(LoginStore.getUser().id, this.id);
    Object.assign(inserts, permission.getInserts());

    return DataServices.UpdateMultiple(inserts)
        .then(() => {
          return this;
        });
  }
}
