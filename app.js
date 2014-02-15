var express = require('express');
var compass = require('node-compass');
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  /*app.use(compass({
    project: 'public',
    css: 'css',
    sass: 'sass'
  }));*/
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
});

app.get('/', function(req, res){
  //res.send('index page');
  res.render('main')
});

app.listen(3002, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});