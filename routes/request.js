var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var utils = require('../lib/util');
var mongo = require('../lib/mongodb');
var async = require('async');



var request = {

    showRequests : function(req,res,next){

        var page = req.query.page || 1;
        var start = constants.settings.per_page * (page - 1);
        var end = constants.settings.per_page * page;


        var projection={

            request_id :1,
            user_id :1,
            created_date:1,
            user_details:1,
            status:1
        }



        mongo.getAllrequests(projection,start,end,function(err,requests){

            if(err)
                next(err);
            else{

                var requests_data = [];
                var pages = [];

                if(requests.length >0 ){

                    async.parallel([

                        function(callback){

                            utils.pageGenerators(requests.length,constants.settings.per_page,page,req.originalUrl,function(err,pagesObj){

                                if(err)
                                    return callback(err);
                                pages = pagesObj;
                                callback();

                            });

                        },
                        function(callback){

                            async.forEach(requests,function(eachrequest,callback){

                                var request = {};
                                request.id = eachrequest.request_id;
                                request.userid=eachrequest.user_id;
                                request.username=eachrequest.user_details.name;
                                request.posted_on = utils.timeReadable(parseInt(eachrequest.created_date));
                                request.status = eachrequest.status;
                                requests_data.push(request);
                                callback();

                            },function(err){

                                if(err)
                                    return callback(err);
                                callback();

                            });

                        }

                    ],function(err){

                        if(err) next(err);
                        res.render('requests',{requests:requests_data,page_data:{pages:pages,first:pages.first,last:pages.last}});

                    });

                }else{
                    res.render('requests',{message:constants.messages['1006']});
                }


            }

        });


    },
    viewRequest : function(req,res,next){


        var request_id = req.query.id || undefined;
        if(request_id !== undefined){

            var query = {
                request_id : request_id
            }

            mongo.getRequestDetails(query,function(err,requestdata){

                if(err)
                    next(err);
                else {

                    if(requestdata) {
                        requestdata.posted_on=utils.timeReadable(parseInt(requestdata.created_date));
                        requestdata.demanded_for=utils.dateReadable(parseInt(requestdata.requested_date));
                    }
                    res.render('request_detail', {request:requestdata});

                }

            });



        }else{


        }
    }

}

module.exports = request;



