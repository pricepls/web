var express = require('express');
var constants = app.get('constants');

var auth = {

    authenticate : function(req,res,next){

        var session_phone = req.session.phone || undefined;
        if(session_phone !== undefined){
            next();
        }else{

            req.flash('error',{message:constants.messages['1005']});
            res.redirect('/login');

        }

    }
}


module.exports = auth;
