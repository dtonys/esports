// require sass
require('test.sass');
require('main.sass');

// require non modular js (via script tag)
require('script!compiled_templates.js');

// require common modules
var FastClick = require('fastclick.js');
var _ = require('lodash.js');
var $ = require('jquery.js');

// require app specific modules
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

