var Promise = require('bluebird');
import LoginStore from '../stores/loginstore';

export default class TestHelper {
  public static TestAccountEmail = 'test@test-account.com';
  public static TestAccountPassword = 'test1234';

    public static TestAccount2Email = 'test2@test-account.com';
    public static TestAccount2Password = 'test1234';

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
}
