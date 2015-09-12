webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	// require sass
	__webpack_require__(1);
	__webpack_require__(11);

	// require non modular js (via script tag)
	__webpack_require__(4);

	// require common modules
	var FastClick = __webpack_require__(7);
	var _ = __webpack_require__(8);
	var $ = __webpack_require__(10);

	// require app specific modules
	var MainPage = __webpack_require__(12);

	$(document).ready(function(e){
	  console.log('main.js loaded: document ready');
	  FastClick.attach(document.body);

	  var mainPage = new MainPage({
	    $container: $('#main'),
	    parent: this
	  });
	  mainPage.initialize();

	});



/***/ },

/***/ 11:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 12:
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8);
	var $ = __webpack_require__(10);

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


/***/ }

});