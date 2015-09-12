/*** CSS ***/
// common
require('base/reset.sass');
require('base/default.sass');
require('components/forms.sass');
require('components/components.sass');
require('layout/layout.sass');
// page specific
require('components.sass');

/*** JS ***/
// global
require('script!compiled_templates.js');
// common
var FastClick = require('fastclick.js');
var _ = require('lodash.js');
var $ = require('jquery.js');

$(document).ready(function(e){
  console.log('components.js loaded: document ready');
  FastClick.attach(document.body);
});

