var cons = require('consolidate');
var ejs = require('ejs')

var bodyParser = require('body-parser');          // todo: test POST
var methodOverride = require('method-override');  // todo: test PUT, DELETE
var multer = require('multer');                   // todo: test multipart POST
var cookieParser = require('cookie-parser');      // check req.cookies
var morgan = require('morgan');   
var favicon = require('serve-favicon');           

var uploads = multer({ dest: 'public/uploads' }); // todo: test upload files
var express = require('express');

var compass = require('node-compass');

var app = express();

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

app.get('/', function(req, res){
  res.render('main')
});

app.get('/styleguide', function(req, res){
  res.render('styleguide')
});

app.listen(3002, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});