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

describe("InvalidPageLoads", function () {

  beforeEach(function(done) {
    this.timeout(10000);
    LoginStore.logout().then(() => done());
  });

  afterEach(function(done) {
    this.timeout(10000);
    LoginStore.logout().then(() => done());
  });

  it("AnimalHomePage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(AnimalHomePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddAnimalPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddAnimalPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("GroupHomePage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(GroupHomePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddNewGroup", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddNewGroup);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("ProfilePage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(ProfilePage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("EditProfile", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(EditProfile);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("SignUpPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(SignUpPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddPhotoPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddPhotoPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("SearchPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(SearchPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("MemberPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(MemberPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("LoginPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(LoginPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("PrivateBetaPage", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(PrivateBetaPage);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("EnterBetaCode", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(EnterBetaCode);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });

  it("AddCalendarEvent", function () {
    let wrappedComponent = TestHelper.WrapWithRouterContext(AddCalendarEvent);
    ReactTestUtils.renderIntoDocument(wrappedComponent);
  });
});
