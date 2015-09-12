var _ = require('lodash.js');
var $ = require('jquery.js');

var MainPage = function( args ){
  _.extend( this, args );
  var _this = this;

  this.initialize = function(){
    this.setupEvents();
  };

  this.setupEvents  = function(){
    this.$container
      .on('click', '.drop-head', this.toggleContent.bind(this) )
      .on('click', '.toggle-code', this.toggleCode.bind(this) ) 
  };

  this.toggleContent = function( e ){
    var $head = $(e.currentTarget);
    var $parent = $head.closest('.section');
    var $content = $parent.find('.drop-content');
    var $arrow = $parent.find('.arrow-drop');
    $content.toggleClass('hidden', !$content.hasClass('hidden') );

    $arrow.hasClass('down') ?
      $arrow.removeClass('down').addClass('up') :
      $arrow.removeClass('up').addClass('down');

    $head.toggleClass('active', !$head.hasClass('active') );

  };

  this.toggleCode = function( e ){
    var $btn = $(e.currentTarget);
    var $parent = $btn.closest('.component-wrap');
    var $content = $parent.find('pre');
    $content.toggleClass('hidden', !$content.hasClass('hidden') );
    $btn.toggleClass('bold', !$btn.hasClass('bold') );
  };
};

module.exports = MainPage;
