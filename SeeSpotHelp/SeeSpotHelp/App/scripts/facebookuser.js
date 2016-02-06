var Volunteer = require('../scripts/volunteer');

var FacebookUser = function () {}

FacebookUser.getVolunteer = function (callback) {
    console.log("FacebookUser.getVolunteer");
    var outer = this;
    this.loadVolunteer = function () {
        console.log("FacebookUser::login : loadVolunteer");
        FB.api("/me", function (response) {
            console.log("Successful login for " + response.name +
                        " with id " + response.id +
                        " and email " + response.email);
            Volunteer.LoadVolunteer(response.id, response.name, response.email, callback);
        });
    };

    this.loginCallback = function (response) {
        console.log("FacebookUser::login : loginCallback");
        if (response.status === "connected") {
            outer.loadVolunteer();
        } else {
            console.log("No facebook login user found.");
            callback(null);
        }
    }

    console.log("Getting fb login status");
    FB.getLoginStatus(this.loginCallback.bind(this));
}

module.exports = FacebookUser;
