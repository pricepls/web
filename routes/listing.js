var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var utils = require('../lib/util');
var request = require('../lib/request');
var mongo = require('../lib/mongodb');
var Chance=require('chance');
var chance = new Chance();
var async = require('async');
var md5 = require('MD5');
var shortId=require('shortid');
var listing = {


    showVendors :function(req,res,next){

        var page = req.query.page || 1;
        var start = constants.settings.per_page * (page - 1);
        var end = constants.settings.per_page * page;
        var query_phone = req.query.phone || undefined;
        if(query_phone){

            mysqlDB.getVendorByPhone(query_phone,function(err,id){

                if(err)
                    next(err);
                else
                    if(id !==null){
                      return  res.redirect('/admin/vendor/view?id='+id);
                    }
            });

        }else {

            mysqlDB.getAllvendors(start, end, function (err, vendors) {

                if (err)
                    next(err);
                else {

                    var vendor_data = [];
                    if (vendors.length > 0) {


                        async.forEach(vendors, function (eachVendors, callback) {

                            var each_vendor_data = {};
                            each_vendor_data.id = eachVendors.id;
                            each_vendor_data.name = eachVendors.name;
                            each_vendor_data.phone = eachVendors.phone;
                            each_vendor_data.contact = eachVendors.contact_no;
                            each_vendor_data.created_date = utils.timeReadable(eachVendors.created_at);
                            each_vendor_data.status = eachVendors.status;
                            vendor_data.push(each_vendor_data);
                            callback();

                        }, function () {

                            if (err)
                                next(err);
                            else
                                res.render('vendors', {vendors: vendor_data});

                        });

                    } else {
                        res.render('vendors', {message: constants.messages['1006']});
                    }

                }

            });
        }
    },
    showListings : function(req,res,next){

        var page = req.query.page || 1;
        var start = constants.settings.per_page * (page - 1);
        var end = constants.settings.per_page * page;
        var projection = {

            listing_id:1,
            vendor_details:1,
            vendor_id:1,
            status:1,
            created_at:1
        };

        mongo.getAllvendors(projection,start,end,function(err,vendors){

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

                                var vendor = {};
                                vendor.id = eachvendor.vendor_id;
                                vendor.listing_id=eachvendor.listing_id;
                                vendor.name = eachvendor.vendor_details.name;
                                vendor.contact = eachvendor.vendor_details.contact_no;
                                vendor.phone = eachvendor.vendor_details.phone;
                                vendor.signed_up_on = utils.timeReadable(parseInt(eachvendor.created_at));
                                vendor.status = eachvendor.status;
                                vendors_data.push(vendor);
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
        console.log(vendor_id);

        var listing_details= {};
        var booking_details = [];
        var request_details = [];
        if(vendor_id !== undefined){

            async.parallel([

                function(callback){

                    var query = {
                        'accepted_vendor.id' : parseInt(vendor_id)
                    }
                    var projections = {
                        booking_id: 1,
                        request_id : 1,
                        user_id : 1,
                        user_details : 1,
                        created_date : 1

                    }

                    mongo.getListingBookings(query,projections,function(err,bookings){

                        if(err)
                            next(err);
                        else{
                            async.forEach(bookings,function(eachBooking,callback){
                                eachBooking.created_at= utils.timeReadable(parseInt(eachBooking.created_date));
                                booking_details.push(eachBooking);
                                callback();
                            },function(){
                                callback();
                            });

                        }
                    });
                },
                function(callback){

                    var query = {
                        vendor_id : parseInt(vendor_id)
                    }

                    mongo.getListingDetails(query,function(err,listData){

                        if(err)
                            next(err);
                        else {
                          if(listData) {
                              listData.created_at = utils.timeReadable(parseInt(listData.created_at));
                          }
                           listing_details = listData;
                           callback();
                        }
                    });


                },
                function(callback){

                    var query={
                        'notified_vendors.vendor_id' : parseInt(vendor_id)
                    };
                    var projections = {

                        request_id:1,
                        user_details:1,
                        user_id:1,
                        created_date:1
                    };
                    var sort = {
                        created_date:-1
                    }
                    mongo.getListingRequests(query,projections,sort,function(err,requests){

                        if(err)
                            next(err);
                        else {

                            async.forEach(requests,function(eachrequest,callback){

                                eachrequest.created_at= utils.timeReadable(parseInt(eachrequest.created_date));
                                request_details.push(eachrequest);
                                callback();

                            },function(err){
                                callback();
                            });
                        }

                    });
                }

            ],function(err){
                res.render('listing_detail',{listing:listing_details,bookings:booking_details,requests:request_details});
            });


        }else{


        }

    },
    newListing : function(req,res,next){

        var countries = [];
        var cities =[];
        var categories = [];
        var amenities=[];

        async.parallel([

            function(callback){

                var country={};
                country.id=1;
                country.name='India';
                countries.push(country);
                callback();

            },
            function(callback){

                mysqlDB.getCities(function(err,citydata){

                   if(err)
                    return callback(err);
                    else
                        cities=citydata;
                        callback();

                });
            },
            function(callback){

                mysqlDB.getCategories(function(err,categs){

                    if(err)
                        return callback(err);
                    else{

                        async.forEach(categs,function(eachcat,callback){

                            var category = {};
                            category.name=eachcat.name;
                            category.id=eachcat.id;
                            var subtypes = eachcat.sub_type.split(',');
                            category.subtypes=subtypes;
                            categories.push(category);
                            callback();

                        },function(err){

                            callback();

                        });
                    }

                });

            },
            function(callback){

                mysqlDB.getAmenities(function(err,amenitiesdata){

                    if(err)
                        return callback(err);
                    else
                        amenities=amenitiesdata;
                        callback();
                });
            }


        ],function(err){

            res.render('vendor_new',{countries:countries,cities:cities,category:categories,amenities:amenities});

        });




    },
    newVendor:function(req,res,next){

        res.render('vendor_new',{});
    },
    validateVendor:function(req,res,next){

        var vendor_name = req.body.vendor_name || undefined;
        var vendor_phone = req.body.vendor_phone || undefined;
        var vendor_contact = req.body.contact_no || undefined;
        var vendor_email = req.body.email || undefined;
        if(vendor_name !==undefined && vendor_phone !== undefined && vendor_contact !== undefined && vendor_email !== undefined) {

            var password = chance.word({length: 6});
            var encrypted=md5(password);
            mysqlDB.newVendor(vendor_phone,encrypted,vendor_contact,vendor_name,vendor_email,function(err,success){

                if(err)
                    next(err);
                else{

                    utils.sendVendorWelcome(vendor_name,vendor_phone,vendor_email,password);
                    res.redirect('/admin/vendors/');

                }

            });

        }


    },
    validateListing : function(req,res,next){


        var vendor_name = req.body.vendor_name || undefined;
        var vendor_phone = req.body.vendor_phone || undefined;
        var vendor_contact = req.body.contact_no || undefined;
        var vendor_email = req.body.email || undefined;

        if(vendor_name !==undefined && vendor_phone !== undefined && vendor_contact !== undefined){

            var password = chance.word({length: 6});
            var encrypted=md5(password);
            mysqlDB.newVendor(vendor_phone,encrypted,vendor_contact,vendor_name,function(err,success){

                if(err)
                    next(err);
                else{

                    var vendor_id=success.insertId;
                    var category=req.body.category;
                    var sub_type = req.body.sub_type;
                    var amenities=req.body.amenities;
                    var star=req.body.star_category;
                    var check_in_check_out=req.body.checkin_time;
                    var check_in_split= check_in_check_out.split('/');
                    var check_in = check_in_split[0];
                    var check_out=check_in_split[1];
                    var country = req.body.country;
                    var country_short=undefined;
                    var country_id = undefined;
                    var state = undefined;
                    var state_short = undefined;
                    var state_id = undefined;
                    var city = req.body.city;
                    var city_id = undefined;
                    var area = req.body.area;
                    var geocode=req.body.geocode;
                    var geocode_split=geocode.split(',');
                    var lat= geocode_split[0];
                    var long=geocode_split[1];
                    var vendor_obj={
                        'name':vendor_name,
                        'phone':vendor_phone,
                        'contact_no':vendor_contact
                    }
                    var images = [];
                    var room_types =[];
                    var current_time = new Date().getTime().toString();
                    var listing_id ="PPL_"+shortId.generate();

                    async.parallel([

                        function(callback){

                           async.forEach(req.files,function(file,callback){

                                var image_path =file.path;
                                var index_id=req.files.indexOf(file)+1;
                                var public_id = 'listings/'+listing_id+'/image_'+ index_id;
                                utils.uploadTocloudanary(image_path,public_id,function(imagerslt){

                                    if(imagerslt){

                                        var image={
                                            name : 'image_'+index_id,
                                            image_path:imagerslt.url
                                        }
                                        images.push(image);
                                        callback();
                                    }
                                });
                            },function(err){
                               callback();
                           });

                        },
                        function(callback){

                            var geocode_url = configs.google.geocode_url;
                            var geocode_key = configs.google.geocode_key;
                            var qs = "latlng="+lat+","+long+"&key="+geocode_key;
                            var final_url = geocode_url+qs;
                            request.makeSimpleGetRequest(final_url,function(err,data){

                                if(!err){
                                    var result = JSON.parse(data).results;
                                    if(result.length > 0){
                                        var first_component = result[2];
                                        var address_components = first_component.address_components;
                                        area = address_components[1].long_name;
                                        city = address_components[2].long_name;
                                        state = address_components[4].long_name;
                                        state_short = address_components[5].short_name;
                                        country = address_components[5].long_name;
                                        country_short = address_components[5].short_name;
                                        mysqlDB.newCounty(country,country_short,function(err,id){
                                            if(!err)
                                                country_id= id;
                                            mysqlDB.newState(state,state_short,country_id,function(err,id){
                                                if(!err)
                                                    state_id= id;
                                                    mysqlDB.newCity(city,country_id,state_id,function(err,id){
                                                        if(!err)
                                                            city_id=id;
                                                        callback();
                                                    });
                                            });
                                        });

                                    }
                                }
                            });
                        },
                        function(callback){

                            var room_1_name=req.body.room_1_name;
                            var room_1_price=req.body.room_1_price;
                            var room_2_name=req.body.room_2_name;
                            var room_2_price=req.body.room_2_price;
                            var room_3_name=req.body.room_name3;
                            var room_3_price=req.body.room_3_price;

                            if(room_1_name || undefined && room_1_price !==undefined){
                                room_types.push({room_type:room_1_name,price:room_1_price});
                            }
                            if(room_2_name || undefined && room_2_price !==undefined){
                                room_types.push({room_type:room_2_name,price:room_2_price});
                            }
                            if(room_3_name || undefined && room_3_price !==undefined){
                                room_types.push({room_type:room_3_name,price:room_3_price});
                            }

                            callback();
                        }


                    ],function(err){

                        if(err)
                            next(err);
                        var query={
                            "listing_id":listing_id,
                            "area":area,
                            "city_id":city_id,
                            "city":city,
                            "state":state,
                            "country":country,
                            "latitude":lat,
                            "longitude":long,
                            "amenities":amenities,
                            "vendor_id":vendor_id,
                            "vendor_details":vendor_obj,
                            "category":category,
                            "sub_category":sub_type,
                            "star_rating":star,
                            "created_at": current_time,
                            "modified_at": current_time,
                            "images":images,
                            "room_types":room_types,
                            "status":"active"
                        }
                        mongo.createListing(query,function(err,success){

                            if(err)
                                next(err);
                            else{
                                res.redirect('/admin/vendor/view/?id='+vendor_id);
                            }
                        });


                    });
                }

            });





        }






    }


}

module.exports = listing;



