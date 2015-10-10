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
var server = exports.server = express();

// Globbing model files
config.getGlobbedFiles('./backend/models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

// Setting application local variables
server.locals.title = config.app.title;
server.locals.description = config.app.description;
server.locals.keywords = config.app.keywords;
server.locals.facebookAppId = config.facebook.clientID;

// defaults for index
server.locals.entry_js = "index";

// proxy for webpack
// var proxy = httpProxy.createProxyServer();

// db connection
var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }

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
    }, server);
    _server = httpsServer;
  }

  server.listen(3001, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, server.settings.env);
  });
});

var production = exports.production = (process.env.NODE_ENV === 'production');

_.extend( server.locals, require('./backend/BE_util.js') );  // give views access to utils

server.engine('ejs', cons.ejs);                              // match view engine to file extension

server.set('view engine', 'ejs');                            // set template engine
server.set('views', __dirname + '/views');                   // set views dir

// Passing the request url to environment locals
server.use(function(req, res, next) {
  res.locals.url = req.protocol + '://' + req.headers.host + req.url;
  next();
});
server.use(compression({
  filter: function(req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
// Showing stack errors
server.set('showStackError', true);
server.use(favicon(__dirname + '/public/favicon.ico'));      // serve favicon
server.use(express.static(__dirname + '/public'));           // serve static assets
server.use(bodyParser.json());                               // body parser, for POST request
server.use(bodyParser.urlencoded({ extended: true }));
server.use(methodOverride());                                // allow PUT and DELETE
server.use(cookieParser());                                  // populate req.cookies
server.use(morgan('dev'));                                   // log requests
server.use(errorhandler());

// Express MongoDB session storage
server.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.sessionSecret,
  store: new mongoStore({
    db: db.connection.db,
    collection: config.sessionCollection
  })
}));

// use passport session
server.use(passport.initialize());
server.use(passport.session());

if (!production) {
  var webpack = require('webpack');
  var dev_config = require('./webpack.config.dev.js');

  var compiler = webpack(dev_config);
  server.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: '/build/'
  }));
  server.use(require('webpack-hot-middleware')(compiler));

  // start webpack-development-server
  // require('./backend/webpack_server.js');
  // proxy static asset requests to it
  // server.all('/build/*', function (req, res) {
  //   proxy.web(req, res, {
  //     target: 'http://localhost:8080'
  //   });
  // });
}

// expose req obj to view
server.use( function( req, res, next ){
  res.locals.req = req;
  next();
});

// Globbing routing files
config.getGlobbedFiles('./backend/routes/**/*.js').forEach(function(routePath) {
  require(path.resolve(routePath))(server);
});

server.get('/', function(req, res){
  res.render('index', { title: 'Index Page' });
});

server.get('/login', function(req, res){
  res.render('index', { title: 'Login Page' });
});

server.get('/signup', function(req, res){
  res.render('index', { title: 'Signup Page' });
});

server.post('/post', function( req, res ){
  console.log( req.body );
  res.json({ result: true });
});

server.get('*', function(req, res){
  res.render('index', {
    title: 'Page Not Found',
    entry_js: 'index'
  });
});

server.use(function(err, req, res, next) {
  // If the error object doesn't exists
  if (!err) return next();

  // Log it
  console.error(err.stack);

  // Error page
  res.status(500).send('500 - server error');
});

// Assume 404 since no middleware responded
server.use(function(req, res) {
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
