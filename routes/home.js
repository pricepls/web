var express=require('express');
var home=express.Router();
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();

var constants = app.get('constants');

var home ={

    index : function(req,res,next){
        res.locals.session = req.session;
        var data ={};
        res.render('index_new',data);

    },
    privacy : function(req,res,next){

        res.locals.session = req.session;
        var data ={};
        res.render('privacy',data);

    },
    terms :function(req,res,next){

        res.locals.session = req.session;
        var data ={};
        res.render('terms',data);

    },
    general :function(req,res,next){

        res.locals.session = req.session;
        var data ={};
        res.render('policies',data);

    },
    contact :function(req,res,next){

        res.locals.session = req.session;
        var data ={};
        res.render('contact',data);

    },
    about :function(req,res,next){

        res.locals.session = req.session;
        var data ={};
        res.render('about',data);

    },
    sendInvite : function(req,res,next){
        res.locals.session = req.session;

        var response = {
            status: "",
            error_code: "",
            error_msg: ""
        }

        var email_id= req.body.email || undefined;
        if(email_id !== undefined){


            mysqlDB.checkEmailExists(email_id,function(err,exists){

                if(err)
                    next(err);
                else {
                    if(!exists) {
                        mysqlDB.insertInvite(email_id, function (err, success) {
                            if (err)
                                next(err);
                            else {
                                response.status = 'success';
                                response.statusCode = 200;
                                res.json(response);
                            }
                        });
                    }else{
                        response.status='failure';
                        response.statusCode=200;
                        response.error_code = "1002";
                        response.error_msg = constants.messages['1002'];
                        res.json(response);
                    }
                }
            });




        }else{

            response.status='failure';
            response.statusCode=200;
            response.error_code = "1001";
            response.error_msg = constants.messages['1001'];
            res.json(response);

        }
    },
    checkLogin : function(req,res,next){




    }


};

module.exports=home;