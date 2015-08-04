var little_time= require('little-time');
var pages = require('simple-paging');

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

    }


}

module.exports = util;