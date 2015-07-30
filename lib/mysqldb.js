"use stric";

var mysql=require('mysql');
var configs=app.get('configs');


module.exports=function(){

    var mysql_connect;

    return {

        init:function(){

            mysql_connect=mysql.createConnection({
                host:configs.mysql.host,
                user:configs.mysql.user,
                password:configs.mysql.password,
                database:'pricepls'
            });
            mysql_connect.connect(function(err){

                if(err)
                    console.log(err);
            });
        },
        insertInvite:function(email,callback){

            var query = 'INSERT INTO invites (email,created_date) VALUES ("'+email+'",NOW())';
            mysql_connect.query(query,function(err,success){

                if(err)
                    callback(err,null);
                else
                    callback(null,success);

            });
        },
        checkEmailExists : function(email,callback){

            var query =' select count(id) as count from invites where email = ?';
            mysql_connect.query(query,[email],function(err,count){

                if(err)
                    callback(err,null);
                else{

                    if(count[0]['count']>0){

                        callback(null,true);

                    }else{

                        callback(null,false);

                    }

                }
            });
        }
    };
};
