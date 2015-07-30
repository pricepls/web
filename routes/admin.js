var express = require('express');
var admin = express.Router();
var reqLib = require('../lib/request');
var configs=app.get('configs');
var vendorapi = configs.servers.vendor_api;

var admin = {


    login : function(req,res,next){

        var data ={};
        res.render('signin',data);

    },
    validateLogin : function(req,res,next){

        var user = req.body.user || undefined;
        var result = {};
        if(user !== undefined){

            var url = vendorapi+'/admin/login';
            var data ='phone='+user.phone+'&password='+user.password;
            reqLib.makePostRequest(url,data,function(err,data){

                if(err){
                    result.message="Login failed";
                    res.render('signin',result);
                }else{
                    res.redirect('/admin/home/');
                }
            });

        }else{

            data.message="";
            res.render('signin',data);
        }

    },
    showHome : function(req,res,next){

        var results={};
        results.bookings_today=0;
        results.listings_today=0;
        results.vendors_today=0;
        results.requests_today=0;
        results.users_today=0;
        var url = vendorapi+'/admin/getstatus';
        reqLib.makeGetRequest(url,null,function(err,data){

            if(err){
                results.message="Login failed";
                res.redirect('/signin',results);
            }else{
                var resData = JSON.parse(data);
                if(resData.status){

                    results.bookings_today=resData.bookings;
                    results.listings_today=resData.listings;
                    results.vendors_today=resData.vendors;
                    results.requests_today=resData.requests;
                    results.users_today=resData.users;
                }
                res.render('home',results);
            }
        });

    },
    viewAllRequests : function(req,res,next){

        var results={};
        var page = req.query.page || 1;
        var url = vendorapi+'/'

    }

}

module.exports = admin;