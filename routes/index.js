var express=require('express');
var router=express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var admin=require('./admin.js');
var home = require('./home.js');
var user = require('./user.js');
var settings = require('./settings.js');
var request = require('./request.js');
var listing = require('./listing.js');
var booking = require('./booking.js');
var auth = require('../lib/auth.js');

router.get('/',home.index);
router.get('/terms',home.terms);
router.get('/privacy',home.privacy);
router.post('/inviteme',home.sendInvite);
router.get('/login',admin.login);
router.post('/login',admin.validateLogin);
router.get('/logout',admin.logout);
router.get('/admin/new/',admin.new);
router.post('/admin/new/',admin.validateAdmin);


//router.get('/logout',admin.logout);
router.get('/admin/home',auth.authenticate,admin.showHome);
router.get('/admin/users',auth.authenticate,user.showUsers);
router.get('/admin/vendors',auth.authenticate,listing.showVendors)
router.get('/admin/listings',auth.authenticate,listing.showListings);
router.get('/admin/bookings',auth.authenticate,booking.showBookings);
router.get('/admin/requests',auth.authenticate,request.showRequests);
router.get('/admin/settings',auth.authenticate,settings.showAllsettings);
router.get('/admin/city/new/',settings.city_new);
router.post('/admin/city/new/',settings.validateCity);
router.get('/admin/amenities/new/',settings.amenity_new);
router.post('/admin/amenities/new/',settings.validateAmenity);


//router.get('/admin/request/view/all',request.viewAllRequests);
//router.get('/admin/request/view',user.viewRequest);
//router.get('/admin/user/view/all',user.viewAllUsers);

router.get('/admin/user/view',auth.authenticate,user.viewUser);
router.get('/admin/request/view',auth.authenticate,request.viewRequest);
router.get('/admin/vendor/view',auth.authenticate,listing.viewVendor);
router.get('/admin/listing/view',auth.authenticate,listing.viewListing);
router.get('/admin/booking/view',auth.authenticate,booking.viewBooking);
router.get('/admin/listing/new',auth.authenticate,listing.newListing);
router.post('/admin/listing/new',auth.authenticate,listing.validateListing);
router.get('/admin/vendor/new',auth.authenticate,listing.newVendor);
router.post('/admin/vendor/new',auth.authenticate,listing.validateVendor);


//router.get('/admin/booking/view','');

//router.post('/admin/vendor/new',listing.createVendor);

//router.get('/admin/listing/view/all',listing.viewAllListings);
//router.get('/admin/listing/view',listing.viewListing);





module.exports = router;