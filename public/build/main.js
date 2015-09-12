webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*** CSS ***/
	// common
	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	// page specific
	__webpack_require__(15);

	/*** JS ***/
	// global
	var templates = __webpack_require__(16);
	console.log(
	  templates("test")({
	    str: "Goodbye Grunt!"
	  })
	)

	// require('script!compiled_templates.js');
	// common
	var FastClick = __webpack_require__(11);
	var _ = __webpack_require__(12);
	var $ = __webpack_require__(14);
	// page specific
	var MainPage = __webpack_require__(19);

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
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function( name ){
	  return __webpack_require__(17)("./"+name+".tmpl.html")
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./test.tmpl.html": 18
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 17;


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div> ' +
	((__t = ( str )) == null ? '' : __t) +
	' </div>';

	}
	return __p
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(14);

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
]);