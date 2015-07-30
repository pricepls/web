var express=require('express'),
    bodyParser=require('body-parser'),
    logger=require('morgan'),
    path  = require('path'),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate');


app=express();
var template_engine = 'dust';
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.engine('dust', cons.dust);
app.set('template_engine', template_engine);
app.set('views', __dirname + '/views');
app.set('view engine', template_engine);
app.use(express.static(path.join(__dirname, 'public')));

var configFile= require('./config.json');

if(app.get('env')=='development'){
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
    res.status(err.status || 500);
    res.json({
        status:'error',
        message: err.message,
        error: {}
    });
});

var port = 8080;


app.listen(port,function(){
    console.log("Price pls web application started ");
});
