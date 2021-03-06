const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var login = require('./routes/login');
var users = require('./routes/users');
var group = require('./routes/group');
var homework = require('./routes/homework');
var subject = require('./routes/subject');
var test = require('./routes/test');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', login);
app.use('/group', group);
app.use('/homework', homework);
app.use('/subject', subject);
app.use('/test', test);
app.use('/users', users);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//facebook stuff
passport.use(new FacebookStrategy({
        clientID: '292701184584377',
        clientSecret: 'd300560cd0a7422e557cffa00124cd88',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            if(err){
                console.log("Error con facebook: " + err);
            }
            if(user){
                return cb(err, user);
            }else{
                let account = new Account();
                account.facebook.id = profile.id;
                acccount.facebook.token = accessToken;
                account.facebook.name = profile.givenName + ' ' + profile.familyName;
                account.facebook.email = profile.emails[0].value();

                account.save(function (err) {
                    if(err){
                        console.log("Error al salvar desde facebook: " + err);
                    }
                    return cb(err, account);
                })
            }
        });
    }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(){
    socket.on('something', function(data, callback) {

    });
    socket.on('disconnect', function(data) {

    });

    function aFunction() {
        io.sockets.emit('usernames', variable);
}
});


module.exports = app;
