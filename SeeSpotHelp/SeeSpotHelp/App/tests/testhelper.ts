import * as React from 'react';

var Promise = require('bluebird');
var expect = require('expect');
import LoginStore from '../stores/loginstore';
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';

import TestData from './testdata';

export default class TestHelper {
  static LoginAsAdmin() : Promise<any> {
    return this.LoginWithTestCredentials(TestData.TestAdminEmail, TestData.TestAdminPassword);
  }

  static LoginAsMember() : Promise<any> {
    return this.LoginWithTestCredentials(TestData.TestMemberEmail, TestData.TestMemberPassword);
  }

  static LoginAsNonMember() : Promise<any> {
    return this.LoginWithTestCredentials(TestData.TestNonMemberEmail, TestData.TestNonMemberPassword);
  }

  static LoginWithTestCredentials(email, password) : Promise<any> {
    let me = this;
    return new Promise(function(resolve, reject) {
      LoginStore.authenticateWithEmailPassword(email, password)
          .then(function() {
             LoginStore.ensureUser().then(function() { resolve(); });
          })
          .catch(function(error) {
            reject();
          });
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

  static CreateTestData() : Promise<any> {
    let me = this;
    return new Promise(function(resolve, reject) {
      me.LoginAsAdmin
          .then(function () { let group = TestData.GetTestGroup(); group.insert()
          .then(() => TestData.InsertTestAnimal(TestData.testGroupId)
          .then(function() {
          let activity = TestData.GetTestActivity(group.id, TestData.testAnimalId);
          activity.insert().then(function() {
            TestData.testActivityId = activity.id;
            let comment = TestData.GetTestComment(group.id, activity.id);
            comment.insert().then(function() {
              TestData.testAdminCommentId = comment.id;
              LoginStore.logout();
              TestHelper.LoginAsMember().then(function() {
                let comment2 = TestData.GetTestComment(group.id, activity.id);
                comment2.insert().then(function() {
                  TestData.testMemberCommentId = comment2.id;
                  LoginStore.logout();
                  resolve();
                });
              });
            });
          });
      })
      );
    });
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
