/*** CSS ***/
// common
require('base/reset.sass');
require('base/default.sass');
require('components/forms.sass');
require('components/components.sass');
require('layout/layout.sass');
// page specific
require('pages/main.sass');

/*** JS ***/
// common
var FastClick = require('fastclick');
var _ = require('lodash');
var $ = require('jquery');
var util = require('FE_util');
var templates = require('templates');

util.frontend();

// page specific
var MainPage = require('MainPage');

$(document).ready(function(e){
  console.log('main.js loaded: document ready');
  FastClick.attach(document.body);

  var mainPage = new MainPage({
    $container: $('#main'),
    parent: this
  });
  mainPage.initialize();

});

