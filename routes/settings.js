var express = require('express');
var configs=app.get('configs');
var constants = app.get('constants');
var mysqlDB = require('../lib/mysqldb')();
mysqlDB.init();
var async = require('async');
var settings = {


    showAllsettings: function(req,res,next){

        var admins_obj = {};
        var cities_obj = {};
        var amenities_obj = {};
        var categories_obj = {};
        var areas_obj = {};

        async.parallel([

            function(callback){

                mysqlDB.getAlladmins(function(err,admins){

                    if(err) return callback(err);
                    admins_obj=admins;
                    callback();
                });
            },
            function(callback){

                mysqlDB.getAllcities(function(err,cities){

                    if(err) return callback(err);
                    cities_obj=cities;
                    callback();
                });
            },
            function(callback){

                mysqlDB.getAllamenities(function(err,amenities){

                    if(err) return callback(err);
                    amenities_obj=amenities;
                    callback();
                });
            },
            function(callback){

                mysqlDB.getAllcategories(function(err,categories){

                    if(err) return callback(err);
                    categories_obj=categories;
                    callback();

                });

            },
            function(callback){

                mysqlDB.getAllareas(function(err,areas){

                    if(err) return callback(err);
                    areas_obj=areas;
                    callback();
                });
            }

        ],function(err){

            if(err){
                next(err);
            }

            res.render('settings',{admins:admins_obj,cities:cities_obj,amenities:amenities_obj,categories:categories_obj,areas:areas_obj});
        })


    },
    city_new : function(req,res,next){

        var country ={
            id:1,
            'name':'India'
        };
        res.render('city_new',{countries:country});
    },
    validateCity : function(req,res,next){

        var city_name = req.body.city_name || undefined;
        var country_id = req.body.country_id || undefined;
        if(city_name !== undefined && country_id !== undefined){

            mysqlDB.newCity(city_name,country_id,function(err,success){
                if (success) {
                    res.redirect('/admin/settings');
                }
            });
        }

    },
    amenity_new : function(req,res,next){

        res.render('amenity_new','');
    },
    validateAmenity : function(req,res,next){
        var name = req.body.name || undefined;
        if(name !== undefined){
            mysqlDB.addAmenity(name,function(err,success){
                if(success){
                    res.redirect('/admin/settings');
                }
            });
        }
    }


}
module.exports = settings;