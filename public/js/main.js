/*** CSS ***/
// common
require('base/reset.sass');
require('base/default.sass');
require('components/forms.sass');
require('components/components.sass');
require('layout/layout.sass');
// page specific
require('main.sass');

/*** JS ***/
// global
var templates = require('templates.js');
console.log(
  templates("test")({
    str: "Goodbye Grunt!"
  })
)

// require('script!compiled_templates.js');
// common
var FastClick = require('fastclick.js');
var _ = require('lodash.js');
var $ = require('jquery.js');
// page specific
var MainPage = require('MainPage.js');

$(document).ready(function(e){
  console.log('main.js loaded: document ready');
  FastClick.attach(document.body);

  var mainPage = new MainPage({
    $container: $('#main'),
    parent: this
  });
  mainPage.initialize();

});

