var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var utils = require('../lib/util');
var mongo = require('../lib/mongodb');
var async = require('async')


var booking = {

    showBookings : function(req,res,next){

        var projection = {

            booking_id:1,
            request_id:1,
            user_id:1,
            user_details:1,
            created_date:1,
            requested_date:1,
            payment_status:1
        };

        var bookings = [];


        mongo.getBookings(projection,function(err,bookings){

            if(err){
                next(err);
            }else{
                async.forEach(bookings,function(eachbooking,callback){

                    eachbooking.created_on = utils.timeReadable(eachbooking.created_date);
                    eachbooking.requested_for = utils.dateReadable(eachbooking.requested_date);
                    bookings.push(eachbooking);

                    callback();

                },function(err){

                    res.render('bookings',{bookings:bookings});
                });

            }
        });

    }

}

module.exports = booking;



