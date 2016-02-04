// tests.webpack.js
//var context = require.context('./App', true, /-test\.jsx?$/);
var context = require.context('./App/tests', true, /addnewshelterpage-test\.jsx?$/);
context.keys().forEach(context);