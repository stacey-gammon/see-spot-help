var Volunteer = require('../scripts/volunteer');

var FacebookUser = function () {}

FacebookUser.getVolunteer = function (callback) {
    console.log("FacebookUser.getVolunteer");
    var outer = this;
    this.loadVolunteer = function () {
        console.log("FacebookUser::login : loadVolunteer");
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            var volunteer = new Volunteer(
                response.name,
                "fakeemail",
                "fakeid");
            callback(volunteer);
        });
    };

    this.loginCallback = function (response) {
        console.log("FacebookUser::login : loginCallback");
        if (response.status === 'connected') {
            outer.loadVolunteer();
        } else {
            callback(null);
        }
    }

    FB.getLoginStatus(this.loginCallback.bind(this));
}

module.exports = FacebookUser;
