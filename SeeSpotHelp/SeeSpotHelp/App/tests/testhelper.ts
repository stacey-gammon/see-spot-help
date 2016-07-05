import * as React from 'react';

var Promise = require('bluebird');
import LoginStore from '../stores/loginstore';
import Group from '../core/databaseobjects/group';
import Animal from '../core/databaseobjects/animal';
import Activity from '../core/databaseobjects/activity';

import TestData from './testdata';

export default class TestHelper {
  public static TestAccountEmail = 'test@test-account.com';
  public static TestAccountPassword = 'test1234';

  public static TestAccount2Email = 'test2@test-account.com';
  public static TestAccount2Password = 'test1234';

  public static testGroupId: string;
  public static testAnimalId: string;
  public static testActivityId: string;

  static LoginWithTestAccount() : Promise<any> {
    let me = this;
    return this.LoginWithTestCredentials(this.TestAccountEmail, this.TestAccountPassword);
  }

  static LoginWithTestAccount2() : Promise<any> {
    let me = this;
    return this.LoginWithTestCredentials(this.TestAccount2Email, this.TestAccount2Password);
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
    const context = { router: this.GetMockedRouter() };
    const contextTypes = { router: React.PropTypes.array };
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
      let group = TestData.GetTestGroup();
      group.insert().then(function() {
        me.testGroupId = group.id;
        let animal = TestData.GetTestAnimal(group.id);
        animal.insert().then(function() {
          me.testAnimalId = animal.id;
          let activity = TestData.GetTestActivity(group.id, animal.id);
          activity.insert().then(function() {
            me.testActivityId = activity.id;
            resolve();
          });
        });
      })
    });
  }

  static DeleteTestData() {
    let group = TestData.GetTestGroup();
    group.id = this.testGroupId;
    group.delete();

    let animal = TestData.GetTestAnimal(group.id);
    animal.id = this.testAnimalId;
    animal.delete();

    let activity = TestData.GetTestActivity(group.id, animal.id);
    activity.id = this.testActivityId;
    activity.delete();
  }
}
