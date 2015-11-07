var little_time= require('little-time');
var pages = require('simple-paging');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'pricepls',
    api_key: '287145665136215',
    api_secret: 'Kfl99Unbk9CQKMf-kp6twk9DqeQ'
});
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contact@pricepls.com',
        pass: 'price@pl$'
    }
});
var constants = app.get('constants');


//var transporter = nodemailer.createTransport();


var util = {

    timeReadable : function(timestamp){

        return little_time(timestamp,'dd-mm-yyyy hh:MM:ss TT');
    },
    dateReadable : function(timestamp){

        return little_time(timestamp,'dd-mm-yyyy');
    },
    pageGenerators : function(totalCount,perpage,current,url,callback){

        var total = totalCount / perpage;
        var pages = paging({
            current : current, total: total, url : url
        });
        callback(null,pages);

    },
    uploadTocloudanary : function(image,publicId,callback){

        cloudinary.uploader.upload(image,function(result) {
            console.log(result)
            callback(result);
        },{public_id:publicId});
    },
    sendVendorWelcome:function(vendor_name,vendor_phone,vendor_email,password){

        var EmailTemplate = require('email-templates').EmailTemplate
        var path = require('path')

        var templateDir = path.join(__dirname, '../views/templates', 'welcome_email');

        var welcome_letter = new EmailTemplate(templateDir)
        var vendor = {name: vendor_name, phone: vendor_phone,password:password,url:constants.application_constants.play_url};
        welcome_letter.render(vendor, function (err, results) {
            var mailOptions = {
                from: 'pricepls contact <contact@pricepls.com>', // sender address
                to: vendor_email, // list of receivers
                subject: 'Welcome to Pricepls', // Subject line
                html: results.html // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);

            });
        })



    }


}

module.exports = util;