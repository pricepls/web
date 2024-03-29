var express = require('express');
var admin = express.Router();
var configs=app.get('configs');
var vendorapi = configs.servers.vendor_api;

var constants = app.get('constants');
var md5=require('MD5');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var mongo=require('../lib/mongodb');
var async = require('async');
var Chance=require('chance');
var chance = new Chance();

var admin = {


    login : function(req,res,next){

        var data ={};
        res.render('signin',data);

    },
    validateLogin : function(req,res,next){

        var session = req.session;
        var phone = req.body.phone || undefined;
        var password = req.body.password || undefined;
        var result = {};
        if(phone !== undefined || password !== undefined){
            password=md5(password);
            mysqlDB.findAdmin(phone,password,function(err,admin){
                if(err)
                    next();
                else{
                    if(admin!==undefined){
                        res.locals.session = req.session;
                        req.session.authenticated = true;
                        req.session.phone = phone;
                        res.redirect('/admin/home');
                    }else{
                        req.flash('error',{message:constants.messages['1005']});
                        res.render('signin',data);
                    }

                }
            });
        }else{

            var data ={};
            data.message=constants.messages['1003'];
            res.render('signin',data);
        }

    },
    logout : function(req,res){
        res.locals.session = req.session;
        req.session.authenticated = false;
        req.session.phone = '';
        res.redirect('/login');


    },
    showHome : function(req,res,next){

        var results={};
        results.bookings_today=0;
        results.listings_today=0;
        results.vendors_today=0;
        results.requests_today=0;
        results.users_today=0;

        var curdate= new Date();
        curdate.setHours(0,0);
        curdate = curdate.getTime();


        async.parallel([
            function(callback) {
                mysqlDB.getVendorsCount(function(err,count){
                    if(err)
                        return callback(err);
                    else
                        results.vendors_today=count;
                    callback();
                });
            },
            function(callback) {
                mysqlDB.getUsersCount(function(err,count){
                    if(err)
                        return callback(err);
                    else
                        results.users_today=count;
                    callback();
                });
            },
            function(callback) {
                var query={
                    'created_date':{$gte:curdate}
                }
                mongo.getlistingCount(query,function(err,count){
                    if(err)
                        return callback(err);
                    else
                        results.listings_today=count;
                    callback();
                });
            },
            function(callback) {
                var query={
                    'created_date':{$gte:curdate}
                }
                mongo.getBookingCount(query,function(err,count){
                    if(err)
                        return callback(err);
                    else
                        results.bookings_today=count;
                    callback();
                });
            }
        ], function(err) {

            if(err){
                next(err);
            }else{

               res.render('home',results);

            }

        });

    },
    viewAllRequests : function(req,res,next){

        var results={};
        var page = req.query.page || 1;
        var url = vendorapi+'/'

    },
    new : function(req,res,next){


        res.render('admin_new','');

    },
    validateAdmin:function(req,res,next){

        var phone = req.body.admin_phone || undefined;
        var name = req.body.admin_name || undefined;
        if(phone !== undefined && name !== undefined){

            var password = chance.word({length: 6});
            var encrypted=md5(password);
            mysqlDB.newAdmin(name,phone,encrypted,function(err,success) {

                if (success) {
                    res.redirect('/admin/settings');
                }
            });
        }
    }

}

module.exports = admin;