if(process.env.ENVIORNMENT!='development')
    require('newrelic');
var express=require('express'),
    bodyParser=require('body-parser'),
    logger=require('morgan'),
    path  = require('path'),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate');
    session = require('express-session');
    flash = require('simple-flash');
    uuid = require('uuid');


app=express();
var template_engine = 'dust';
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('dust', cons.dust);
app.set('template_engine', template_engine);
app.set('views', __dirname + '/views');
app.set('view engine', template_engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({genid: function(req) { return uuid.v4();},resave: false,saveUninitialized:false,secret: 'price@pl$',maxAge: 1*1000}));

var configFile= require('./config.json');

if(process.env.ENVIORNMENT =='development'){

    configs=configFile.development;
}else{
    configs=configFile.production;
}
// setting the config to make it available everywhere
app.set('configs',configs);


var constants=require('./constants.json');
app.set('constants',constants);

var routes = require('./routes');
app.use('/',routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status:'error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

    if(err.status && err.status != 500){
        res.status(err.status);
        res.render('404','');
    }else{
        res.status(err.status || 500);
        res.render('500','');
    }

});

var port = 8080;


app.listen(port,function(){
    console.log("Price pls web application started on "+port);
});
