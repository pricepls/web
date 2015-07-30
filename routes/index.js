var express=require('express');
var router=express.Router();



var admin=require('./admin.js');
var home = require('./home.js');

router.get('/',home.index);
router.post('/inviteme',home.sendInvite);
router.get('/login',admin.login);
router.post('/login',admin.validateLogin);
//router.get('/logout',admin.logout);
router.get('/admin/home',admin.showHome);
//router.get('/admin/request/view/all',request.viewAllRequests);
//router.get('/admin/request/view',user.viewRequest);
//router.get('/admin/user/view/all',user.viewAllUsers);
//router.get('/admin/user/view',user.viewUser);
//router.get('/admin/vendor/view/all',vendor.viewAllVendors);
//router.get('/admin/vendor/view',vendor.viewVendor);
//router.get('/admin/listing/view/all',listing.viewAllListings);
//router.get('/admin/listing/view',listing.viewListing);





module.exports = router;