var Volunteer = require("../core/volunteer");
var LoginActions = require("../actions/loginactions");

var FacebookUser = function () {}

FacebookUser.login = function () {
    console.log("FacebookUser.login");
    var outer = this;
    this.loadVolunteer = function () {
        console.log("FacebookUser::login : loadVolunteer");
        FB.api("/me", function (response) {
            console.log("Successful login for " + response.name +
                        " with id " + response.id +
                        " and email " + response.email);
            Volunteer.LoadVolunteer(
                response.id, response.name, response.email, LoginActions.userLoggedIn);
        });
    };

    this.loginCallback = function (response) {
        console.log("FacebookUser::login : loginCallback");
        if (response.status === "connected") {
            outer.loadVolunteer();
        } else {
            console.log("No facebook login user found.");
            LoginActions.userLogInFailed(new Error("No facebook user found"));
        }
    }

    console.log("Getting fb login status");
    FB.getLoginStatus(this.loginCallback.bind(this));
}

module.exports = FacebookUser;
