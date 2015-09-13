webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*** CSS ***/
	// common
	__webpack_require__(1);
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(9);
	__webpack_require__(11);
	// page specific
	__webpack_require__(22);

	/*** JS ***/
	// common
	var FastClick = __webpack_require__(18);
	var _ = __webpack_require__(19);
	var $ = __webpack_require__(21);
	var templates = __webpack_require__(24);

	// page specific
	var MainPage = __webpack_require__(28);

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
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?indentedSyntax!./main.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?indentedSyntax!./main.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  text-align: center; }\n\nhtml {\n  background-color: #ddd; }\n\n#main {\n  background-color: #ddd; }\n  #main .title {\n    font-size: 26px; }\n  #main .text1 {\n    font-size: 18px; }\n  #main .yinyang {\n    background-color: white;\n    border-radius: 50px; }\n\n.layout-content {\n  margin-top: 0; }\n", ""]);

	// exports


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function( name ){
	  return __webpack_require__(25)("./"+name+".tmpl.html")
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./dir1/dir_test.tmpl.html": 26,
		"./test.tmpl.html": 27
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
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div> dir1: ' +
	((__t = ( str )) == null ? '' : __t) +
	' </div>';

	}
	return __p
	}

/***/ },
/* 27 */
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(19);
	var $ = __webpack_require__(21);

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