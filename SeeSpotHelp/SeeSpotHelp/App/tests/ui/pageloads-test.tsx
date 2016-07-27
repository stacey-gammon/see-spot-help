import * as React from 'react';
var ReactDOM = require("react-dom");
var ReactTestUtils = require('react-addons-test-utils');
var expect = require('expect');

import GroupHomePage from '../../ui/group/grouphomepage';
import ProfilePage from '../../ui/person/profilepage';
import EditProfile from '../../ui/person/editprofile';
import AddNewGroup from '../../ui/group/addnewgroup';
import AddAnimalNote from '../../ui/animal/addanimalnote';
import AnimalHomePage from '../../ui/animal/animalHomePage';
import AddAnimalPage from '../../ui/animal/addanimalpage';
import SignUpPage from '../../ui/auth/signuppage';

import AddPhotoPage from '../../ui/addphotopage';
var SearchPage = require('../../ui/searchpage');
import MemberPage from '../../ui/person/memberpage';
import LoginPage from '../../ui/auth/loginpage';
var PrivateBetaPage = require('../../ui/privatebetapage');
var EnterBetaCode = require('../../ui/enterbetacode');
import AddCalendarEvent from '../../ui/addcalendarevent';

import LoginStore from '../../stores/loginstore';
import TestHelper from '../testhelper';

var d3 = require("d3");

describe("Page ", function () {

  beforeEach(function() {
    this.timeout(10000);
    return TestHelper.LoginAsAdmin();
  });

  afterEach(function() {
    this.timeout(100000);
    return TestHelper.DeleteAllTestData();
  });


  describe("Animal Home", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(AnimalHomePage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(AnimalHomePage);
      });
    });
  });

  describe("Add Animal", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(AddAnimalPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(AddAnimalPage);
      });
    });
  });
  describe("Group Home ", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(GroupHomePage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(GroupHomePage);
      });
    });
  });

  describe("Add new group ", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(AddNewGroup);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(AddNewGroup);
      });
    });
  });

  describe("Profile page ", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(ProfilePage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(ProfilePage);
      });
    });
  });

  describe("Edit profile", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(EditProfile);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(EditProfile);
      });
    });
  });

  describe("Sign up page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(SignUpPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(SignUpPage);
      });
    });
  });
  describe("Add photo page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(AddPhotoPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(AddPhotoPage);
      });
    });
  });
  describe("search page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(SearchPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(SearchPage);
      });
    });
  });
  describe("member page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(MemberPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(MemberPage);
      });
    });
  });
  describe("login page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(LoginPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(LoginPage);
      });
    });
  });
  describe("private beta page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(PrivateBetaPage);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(PrivateBetaPage);
      });
    });
  });
  describe("Enter beta code page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(EnterBetaCode);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(EnterBetaCode);
      });
    });
  });
  describe("Add calendar event page", function () {
    it("loads when logged in", function () {
      TestHelper.MountAndUnMountPage(AddCalendarEvent);
    });

    it("loads when logged out", function () {
      return LoginStore.logout().then(() => {
        TestHelper.MountAndUnMountPage(AddCalendarEvent);
      });
    });
  });
});
