var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var utils = require('../lib/util');
var mongo = require('../lib/mongodb');

var async = require('async');

var listing = {

    showListings : function(req,res,next){

        var page = req.query.page || 1;
        var start = constants.settings.per_page * (page - 1);
        var end = constants.settings.per_page * page;

        mysqlDB.getAllvendors(start,end,function(err,vendors){

            if(err)
                next(err);
            else{

                var vendors_data = [];
                var pages = [];

                if(vendors.length >0 ){

                    async.parallel([

                        function(callback){

                            utils.pageGenerators(vendors.length,constants.settings.per_page,page,req.originalUrl,function(err,pagesObj){

                                if(err)
                                    return callback(err);
                                pages = pagesObj;
                                callback();

                            });

                        },
                        function(callback){

                            async.forEach(vendors,function(eachvendor,callback){

                                var user = {};
                                user.id = eachvendor.id;
                                user.name = eachvendor.name;
                                user.email = eachvendor.email;
                                user.phone = eachvendor.phone;
                                user.signed_up_on = utils.timeReadable(eachvendor.created_at);
                                user.status = eachvendor.status;
                                vendors_data.push(user);
                                callback();

                            },function(err){

                                if(err)
                                    return callback(err);
                                callback();

                            });

                        }

                    ],function(err){

                        if(err) next(err);
                        res.render('listings',{vendors:vendors_data,page_data:{pages:pages,first:pages.first,last:pages.last}});

                    });

                }else{
                    res.render('listings',{message:constants.messages['1006']});
                }


            }

        });

    },
    viewVendor : function(req,res,next){

        var vendor_id = req.query.id || undefined;
        if(vendor_id !== undefined){

            var query = {

                vendor_id : parseInt(vendor_id)
            }

            mongo.getListingDetails(query,function(err,listData){

                if(err)
                    next(err);
                else {

                    listData.created_at= utils.timeReadable(parseInt(listData.created_at));
                    res.render('listing_detail',{listing:listData});

                }
            });

        }else{


        }

    }

}

module.exports = listing;



