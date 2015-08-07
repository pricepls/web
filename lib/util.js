var little_time= require('little-time');
var pages = require('simple-paging');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'pricepls',
    api_key: '287145665136215',
    api_secret: 'Kfl99Unbk9CQKMf-kp6twk9DqeQ'
});

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
    }


}

module.exports = util;