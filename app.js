var cons = require('consolidate');
var ejs = require('ejs');
var _ = require('lodash');

var bodyParser = require('body-parser');          // todo: test POST
var methodOverride = require('method-override');  // todo: test PUT, DELETE
var multer = require('multer');                   // todo: test multipart POST
var cookieParser = require('cookie-parser');      // check req.cookies
var morgan = require('morgan');
var favicon = require('serve-favicon');
var compression = require('compression');
var errorhandler = require('errorhandler');
var cors = require('cors');

var uploads = multer({ dest: 'public/uploads' }); // todo: test upload files
var express = require('express');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var app = express();

var isProduction = process.env.NODE_ENV === 'production';

_.extend( app.locals, require('./backend/BE_util.js') );  // give views access to utils

app.engine('ejs', cons.ejs);                              // match view engine to file extension

app.set('views', __dirname + '/views');                   // set views dir
app.set('view engine', 'ejs');                            // set template engine

app.use(favicon(__dirname + '/public/favicon.ico'));      // serve favicon
app.use(express.static(__dirname + '/public'));           // serve static assets
app.use(bodyParser.json());                               // body parser, for POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());                                // allow PUT and DELETE
app.use(cookieParser());                                  // populate req.cookies
app.use(morgan('dev'));                                   // log requests
app.use(compression());
app.use(errorhandler());


if (!isProduction) {
  // start webpack-dev-server
  require('./backend/webpack_server.js')();
  // proxy static asset requests to it
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });
}

// expose req obj to view
app.use( function( req, res, next ){
  res.locals.req = req;
  next();
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Index Page',
    entry_js: 'index'
  });
});

app.get('/profile', function(req, res){
  res.render('index', {
    title: 'Profile Page',
    // entry_js: 'profile'
    entry_js: 'index'
  });
});

app.get('/matches', function(req, res){
  res.render('index', {
    title: 'Matches Page',
    // entry_js: 'matches'
    entry_js: 'index'
  });
});

app.get('/match/:id', function(req, res){
  res.render('index', {
    title: 'Match ' + req.params.id,
    // entry_js: 'match'
    entry_js: 'index'
  });
});

app.post('/post', function( req, res ){
  console.log( req.body );
  res.json({ result: true });
});

app.get('*', function(req, res){
  res.render('index', {
    title: 'Page Not Found',
    entry_js: 'index'
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
