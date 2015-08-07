var express = require('express');

var booking = {

    showBookings : function(req,res,next){



        res.render('bookings','');

    }

}

module.exports = booking;



