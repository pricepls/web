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

            booking_number:1,
            request_number:1,
            booking_id:1,
            request_id:1,
            user_id:1,
            user_details:1,
            created_date:1,
            requested_date:1,
            booking_date:1,
            booking_status:1,
            payment_status:1
        };

        var bookings = [];


        mongo.getBookings(projection,function(err,Allbookings){


            if(err){
                next(err);
            }else{
                async.forEach(Allbookings,function(eachbooking,callback){

                    eachbooking.created_on = utils.timeReadable(eachbooking.booking_date);
                    eachbooking.requested_for = utils.dateReadable(parseInt(eachbooking.requested_date));
                    bookings.push(eachbooking);

                    callback();

                },function(err){

                    res.render('bookings',{bookings:bookings});
                });

            }
        });

    },
    viewBooking :function(req,res,next){

        var booking_id = req.query.id || undefined;

        var booking_details = {};

        var query = {
            booking_id : booking_id
        }

        var projection = {};
        mongo.getBookingDetails(query,projection,function(err,details){


            if(err)
                next(err);
            else{

                booking_details = details;
                booking_details.booking_date = utils.timeReadable(details.booking_date);
                booking_details.requested_date = utils.dateReadable(parseInt(details.requested_date));

                booking_details.booking_states.forEach(function(eachState){

                    var time =  utils.timeReadable(eachState.timestamp);
                    eachState.timeReadable = time;

                })

                console.log(JSON.stringify(booking_details));

                res.render('booking_detail',{booking:booking_details});
            }
        });
    }
}

module.exports = booking;



