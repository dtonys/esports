var cons = require('consolidate');
var ejs = require('ejs');
var _ = require('lodash');

var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');

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
var session = require('express-session');
var passport = require('passport');
var mongoStore = require('connect-mongo')({
  session: session
});
var flash = require('connect-flash');

var httpProxy = require('http-proxy');
var config = require('./config/config');

//
var ngrok = require('ngrok');
var chalk = require('chalk');
var mongoose = require('mongoose');
var BlockIo = require('block_io');

var block_io = new BlockIo('c3f9-2390-cd21-204b', 'OMFGblock10', 2);
//

// main server connection
var app = express();

// Globbing model files
config.getGlobbedFiles('./backend/models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

// Setting application local variables
app.locals.title = config.app.title;
app.locals.description = config.app.description;
app.locals.keywords = config.app.keywords;
app.locals.facebookAppId = config.facebook.clientID;

// defaults for index
app.locals.entry_js = "index";

// proxy for webpack
var proxy = httpProxy.createProxyServer();

// db connection
var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }

  var server = app;
  // have not tested this block - Tony
  if (process.env.NODE_ENV === 'secure') {
    // Log SSL usage
    console.log('Securely using https protocol');

    // Load SSL key and certificate
    var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
    var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

    // Create HTTPS Server
    var httpsServer = https.createServer({
      key: privateKey,
      cert: certificate
    }, app);
    server = httpsServer;
  }

  server.listen(3001, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});

var isProduction = process.env.NODE_ENV === 'production';

_.extend( app.locals, require('./backend/BE_util.js') );  // give views access to utils

app.engine('ejs', cons.ejs);                              // match view engine to file extension

app.set('view engine', 'ejs');                            // set template engine
app.set('views', __dirname + '/views');                   // set views dir

// Passing the request url to environment locals
app.use(function(req, res, next) {
  res.locals.url = req.protocol + '://' + req.headers.host + req.url;
  next();
});
app.use(compression({
  filter: function(req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
// Showing stack errors
app.set('showStackError', true);
app.use(favicon(__dirname + '/public/favicon.ico'));      // serve favicon
app.use(express.static(__dirname + '/public'));           // serve static assets
app.use(bodyParser.json());                               // body parser, for POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());                                // allow PUT and DELETE
app.use(cookieParser());                                  // populate req.cookies
app.use(morgan('dev'));                                   // log requests
app.use(errorhandler());

// Express MongoDB session storage
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.sessionSecret,
  store: new mongoStore({
    db: db.connection.db,
    collection: config.sessionCollection
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

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

// Globbing routing files
config.getGlobbedFiles('./backend/routes/**/*.js').forEach(function(routePath) {
  require(path.resolve(routePath))(app);
});

app.get('/', function(req, res){
  res.render('index', { title: 'Index Page' });
});

app.get('/login', function(req, res){
  res.render('index', { title: 'Login Page' });
});

app.get('/signup', function(req, res){
  res.render('index', { title: 'Signup Page' });
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

app.use(function(err, req, res, next) {
  // If the error object doesn't exists
  if (!err) return next();

  // Log it
  console.error(err.stack);

  // Error page
  res.status(500).send('500 - server error');
});

// Assume 404 since no middleware responded
app.use(function(req, res) {
  res.status(404).send('404 - page not found');
});

// Bootstrap passport config
require('./config/passport')();

//Finds all webhooks that are open. removes all of them, then creates a new one.
function startBlockIoWebhooks(url) {

  //Get all current webhooks.
  block_io.get_notifications({}, function (req, res) {
    //console.log(res.data);

    var createnew = true;

    //for each webhook, check to see if type = account. if so, delete it.
    for (var i in res.data)
    {
      var notif = res.data[i];
      if (notif.type === 'account')
      {
        console.log('Found old!');
        createnew = false;
        block_io.delete_notification(
          {'notification_id' : notif.notification_id}, createBlockIoWebhook(url));
      }
    }

    //If we haven't made one after deleting one, we need to make a new one.
    if (createnew)
    {
      console.log('Creating New');
      //afterwards, create a notification.
      createBlockIoWebhook(url);
    }
  });
}

function createBlockIoWebhook(url) {
  console.log('Creating Webhook!');
  //afterwards, create a notification.
  block_io.create_notification({'type':'account', 'url':url}, function (req, res)
  {
    console.log('Webhook created!' + res.data);
  });
}

//
ngrok.connect(5000, function(err, url) {
  console.log('ngrok: ' + url);
  startBlockIoWebhooks(url);
});
