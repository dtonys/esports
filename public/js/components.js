// require sass
require('test.sass');
require('components.sass');

// require non modular js via script tag
require('script!compiled_templates.js');

// require common modules
var FastClick = require('fastclick.js');
var _ = require('lodash.js');
var $ = require('jquery.js');

$(document).ready(function(e){
  console.log('components.js loaded: document ready');
  FastClick.attach(document.body);
});

