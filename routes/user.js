var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var utils = require('../lib/util');
var mongo = require('../lib/mongodb');

var async = require('async');

var user = {

    showUsers : function(req,res,next){

        var page = req.query.page || 1;
        var start = constants.settings.per_page * (page - 1);
        var end = constants.settings.per_page * page;

        mysqlDB.getAllusers(start,end,function(err,users){

            if(err)
                next(err);
            else{

                var users_data = [];
                var pages = [];

                if(users.length >0 ){

                    async.parallel([

                        function(callback){

                            utils.pageGenerators(users.length,constants.settings.per_page,page,req.originalUrl,function(err,pagesObj){

                                if(err)
                                    return callback(err);
                                pages = pagesObj;
                                callback();

                            });

                        },
                        function(callback){

                            async.forEach(users,function(eachuser,callback){

                                var user = {};
                                user.id = eachuser.id;
                                user.name = eachuser.name;
                                user.email = eachuser.email;
                                user.phone = eachuser.phone;
                                user.signed_up_on = utils.timeReadable(eachuser.created_date);
                                user.status = eachuser.status;
                                users_data.push(user);
                                callback();

                            },function(err){

                                if(err)
                                    return callback(err);
                                callback();

                            });

                        }

                    ],function(err){

                        if(err) next(err);
                        res.render('users',{users:users_data,page_data:{pages:pages,first:pages.first,last:pages.last}});

                    });

                }else{
                    res.render('users',{message:constants.messages['1006']});
                }


            }

        });
    },
    viewUser : function(req,res,next){

        var user_id = req.query.id || undefined;
        if(user_id !== undefined){

            var user_id = parseInt(user_id);


            var user_data={};
            var request_data=[];
            var booking_data=[];


            async.parallel([

                function(callback){

                    var query = {
                        user_id : user_id
                    }
                    mongo.getuserDetails(query,function(err,userdata){

                        if(err)
                            return callback(err);
                        else {
                            if(userdata) {

                                user_data=userdata;
                                user_data.created_date = utils.timeReadable(parseInt(userdata.created_date));

                            }
                            callback();
                        }

                    });

                },
                function(callback){

                    var query={
                        user_id : user_id
                    }
                    var projections = {
                        request_id : 1,
                        created_date : 1
                    }
                    var sort = {
                        created_date:-1
                    }

                    mongo.getuserRequests(query,projections,sort,function(err,requestdata){

                        if(err)
                            return callback(err);
                        else {


                            async.forEach(requestdata,function(request,callback){

                                var req={};
                                req.id=request.request_id;
                                req.posted_on=utils.timeReadable(parseInt(request.created_date));
                                request_data.push(req);
                                callback();

                            },function(err){
                                if(err)
                                    return callback(err);
                                callback();
                            })

                        }

                    });

                }


            ],function(err){

                if(err)
                    next(err);

                res.render('user_detail', {user: user_data,requests:request_data});

            });



        }else{




        }

    }

}

module.exports = user;



