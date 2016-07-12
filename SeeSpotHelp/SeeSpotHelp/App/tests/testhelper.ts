import * as React from 'react';

var Promise = require('bluebird');
var expect = require('expect');
import LoginStore from '../stores/loginstore';
import GroupStore from '../stores/groupstore';
import PermissionsStore from '../stores/permissionsstore';
import Group from '../core/databaseobjects/group';
import GroupEditor from '../core/editor/groupeditor';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';
import Permission from '../core/databaseobjects/permission';
import DataServices from '../core/dataservices';

import TestData from './testdata';

export default class TestHelper {

  static LoginAsSuperAdmin() : Promise<any> {
    console.log('LoginAsSuperAdmin');
    return this.LoginWithTestCredentials('sa@theshelterhelper.com', 'sa329pp2f');
  }

  static LoginAsAdmin() : Promise<any> {
    console.log('LoginAsAdmin');
    return this.LoginWithTestCredentials(TestData.TestAdminEmail, TestData.TestAdminPassword)
        .then(() => {
          expect(DataServices.GetAuthData().email).toEqual(TestData.TestAdminEmail);
          console.log('Now checking loginstore');
          expect(LoginStore.getUser().email).toEqual(TestData.TestAdminEmail);
          TestData.TestAdminId = LoginStore.getUser().id;
            console.log('LoginAsAdmin: Finish');
          return TestData.TestAdminId;
        });
  }

  static LoginAsMember() : Promise<any> {
    console.log('LoginAsMember');
    return this.LoginWithTestCredentials(TestData.TestMemberEmail, TestData.TestMemberPassword)
        .then(() => {
          expect(DataServices.GetAuthData().email).toEqual(TestData.TestMemberEmail);
          console.log('Now checking loginstore');
          expect(LoginStore.getUser().email).toEqual(TestData.TestMemberEmail);
          TestData.TestMemberId = LoginStore.getUser().id;
            console.log('LoginAsMember: Finish');
          return TestData.TestMemberId;
        });
  }

  static LoginAsNonMember() : Promise<any> {
    console.log('LoginAsNonMember');
    return this.LoginWithTestCredentials(TestData.TestNonMemberEmail, TestData.TestNonMemberPassword)
        .then(() => {
          TestData.TestNonMemberId = LoginStore.getUser().id;
          expect(DataServices.GetAuthData().email).toEqual(TestData.TestNonMemberEmail);
          console.log('Now checking loginstore');
          expect(LoginStore.getUser().email).toEqual(TestData.TestNonMemberEmail);
          return TestData.TestNonMemberId;
        });
  }

  static LoginWithTestCredentials(email, password) : Promise<any> {
    console.log('Login with email ' + email + ' and pw: ' + password);
    let me = this;
    return new Promise(function(resolve, reject) {
      LoginStore.logout().then(() =>
          LoginStore.authenticateWithEmailPassword(email, password).then(() => {
             console.log('Authenticated with ' + email + ' and pw ' + password);
             LoginStore.ensureUser().then(() => {
               expect(DataServices.GetAuthData()).toNotEqual(null);
               resolve();
             });
          }))
          .catch(reject);
    });
  }

  static DeleteTestDataForUser() : Promise<any> {
    console.log('DeleteTestDataForUser for user ' + LoginStore.getUser().id);
     return PermissionsStore.ensureItemsByProperty('userId', LoginStore.getUser().id)
        .then((items) => {
          let promises = [];
          console.log('Permissions for user ' + LoginStore.getUser().id, items);
          for (let i = 0; i < items.length; i++) {
            console.log('Deleting permission ', items[i]);
            console.log('For user ' + LoginStore.getUser().id);
            let permission = items[i];
            promises.push(GroupStore.ensureItemById(permission.groupId).then((group) => {
              if (group) {
                console.log('Deleting group ', group);
                return new GroupEditor(group).delete();
              } else {
                console.log('Deleting only permission ', permission);
                return permission.shallowDelete();
              }
            }));
          }

          return Promise.all(promises).then(function() {
            console.log('DeleteTestDataForUser for user ' + LoginStore.getUser().id +
                        ' all promises finished');
          });
      })
      .catch(function(error) {
        console.log('Error ensureItemsByProperty: ', error);
        throw error;
      });
  }

  static DeleteAllTestData() : Promise<any> {
    console.log('DeleteAllTestData');
    return this.LoginAsAdmin()
        .then(() => { return TestHelper.DeleteTestDataForUser(); })
        .then(() => { return this.LoginAsMember(); })
        .then(() => { return TestHelper.DeleteTestDataForUser(); })
        .then(() => { return this.LoginAsNonMember(); })
        .then(() => { return TestHelper.DeleteTestDataForUser(); })
        .catch((error) => {
          console.log('Error Deleting all test data: ', error);
          throw error;
        });
  }

  static GetMockedRouter() {
    return {
      push() {},
      createHref() {},
      isActive() { return false; }
    };
  }

  static WrapWithRouterContext(element) {
    const context = { router: this.GetMockedRouter() } as any;
    const contextTypes = { router: React.PropTypes.array } as any;
    const wrapperWithContext = React.createClass({
        childContextTypes: contextTypes,
        getChildContext: function() { return context },
        render: function() {
          return React.createElement(element)
        }
    });

    return React.createElement(wrapperWithContext);
  }

  static AddTestMemberToGroup() {
    let me = this;
    expect(LoginStore.getUser().email).toEqual(TestData.TestAdminEmail);
    let permission = Permission.CreateMemberPermission(TestData.TestMemberId, TestData.testGroupId);
    return permission.insert()
        .then(() => {
          return PermissionsStore.ensureItemsByProperty('userId', TestData.TestMemberId)
              .then((items : Array<Permission>) => {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].groupId == TestData.testGroupId) {
                      expect(items[i].inGroup()).toEqual(true);
                      return items;
                    }
                  }
                  console.log('No permission found');
              });
        })
        .catch(function(error) {
          console.log('AddTestMemberToGroup Error: ', error);
          return error;
        });
  }

  static CreateTestData() : Promise<any> {
    let me = this;
    return this.LoginAsAdmin()
        .then(() => { return TestData.InsertTestGroup(); })
        .then(() => { return TestHelper.LoginAsMember(); })
        .then(() => { return TestHelper.LoginAsNonMember(); })
        .then(() => { return TestHelper.LoginAsAdmin(); })
        .then(() => { return TestHelper.AddTestMemberToGroup(); })
        .then(() => { return TestData.InsertTestAnimal(TestData.testGroupId); })
        .then(() => { return TestData.InsertTestActivity(TestData.testGroupId, TestData.testAnimalId); })
        .then(() => { return TestData.InsertAdminComment(TestData.testGroupId, TestData.testActivityId); })
        .then(() => { return TestHelper.LoginAsMember(); })
        .then(() => { return TestData.InsertMemberComment(TestData.testGroupId, TestData.testActivityId); })
        .then(() => { return me.LoginAsAdmin(); })
        .then(() => { return; })
        .catch(function (error) {
          console.log('Error creating test data: ', error);
          throw error;
        });
  }

  static ExpectItemIsDeleted(id, store) : Promise<any> {
    return new Promise(function(resolve, reject) {
      store.ensureItemById(id).then(function() {
        let item = store.getItemById(id);
        expect(item).toEqual(null);
        if (!item) {
          resolve();
        } else {
          reject();
        }
      }, reject);
    });
  }

  static DeleteTestData() {
    let group = TestData.GetTestGroup();
    group.id = TestData.testGroupId;
    group.shallowDelete();

    let animal = TestData.GetTestAnimal(group.id);
    animal.id = TestData.testAnimalId;
    animal.shallowDelete();

    let activity = TestData.GetTestActivity(group.id, animal.id);
    activity.id = TestData.testActivityId;
    activity.shallowDelete();
  }
}
