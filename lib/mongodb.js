"use strict"

var mongoDriver=require('mongoskin');
var configs=app.get('configs');
var pricepls_db = mongoDriver.db('mongodb://'+configs.mongo.host+'/pricepls');
var COLLECTION_LISTING='listings';
var COLLECTION_REQUESTS='requests';
var COLLECTION_BOOKINGS='bookings';
var COLLECTION_USERS = 'users';

var mongo={

    getlistingCount : function(query,callback){

        pricepls_db.collection(COLLECTION_LISTING).count(query,function(err,count){

            if(err)
                callback(err,null)
            else{
                callback(null,count);
            }
        });
    },
    getBookingCount : function(query,callback){

        pricepls_db.collection(COLLECTION_BOOKINGS).count(query,function(err,count){

            if(err)
                callback(err,null)
            else{
                callback(null,count);
            }
        });
    },
    getuserDetails : function(query,callback){

        pricepls_db.collection(COLLECTION_USERS).find(query).toArray(function(err,userdata){

            if(err)
                callback(err,null);
            else
                callback(null,userdata[0]);
        });

    },
    getListingDetails : function(query,callback){
        pricepls_db.collection(COLLECTION_LISTING).find(query).toArray(function(err,listingdata){

            if(err)
                callback(err,null);
            else
                callback(null,listingdata[0]);

        });

    },
    getuserRequests : function(query,projection,sort,callback){

        pricepls_db.collection(COLLECTION_REQUESTS).find(query,projection).toArray(function(err,requestdata){

            if(err)
                callback(err,null);
            else
                callback(null,requestdata);

        });
    },
    getAllrequests : function(projection,start,end,callback){

        pricepls_db.collection(COLLECTION_REQUESTS).find({},projection).sort({'created_date':-1}).limit(end).skip(start).toArray(function(err,requests){

            if(err)
                callback(err,null);
            else
                callback(null,requests);

        });
    },
    getRequestDetails : function(query,callback){

        pricepls_db.collection(COLLECTION_REQUESTS).find(query).toArray(function(err,requestdata){

            if(err)
                callback(err);
            else
                callback(null,requestdata[0]);

        });
    }



}
module.exports=mongo;