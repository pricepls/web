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
        },
        findAdmin:function(phone,password,callback){
            var query='select id,name from admins where phone=? and password=? and status=\'active\'';
            mysql_connect.query(query,[phone,password],function(err,admin){

                if(err)
                    callback(err,null);
                else{

                    if(admin.length>0){

                        callback(null,admin[0]);
                    }else{
                        callback(null,undefined);
                    }

                }

            });
        },
        getVendorsCount : function(callback){

            var query ='select count(id) as count from vendors where created_at = CURDATE()';
            mysql_connect.query(query,function(err,count){

                if(err)
                    callback(err,null);
                else
                    callback(null,count[0]['count']);

            });
        },
        getUsersCount : function(callback){

            var query = 'select count(id) as count from users where created_date = CURDATE() ';
            mysql_connect.query(query,function(err,count){

                if(err)
                    callback(err,null);
                else
                    callback(null,count[0]['count']);
            });

        },
        getAllusers : function(start,end,callback){

            var query = 'select id,phone,name,email,status,created_date from users order by created_date LIMIT '+start+','+end;
            mysql_connect.query(query,function(err,users){

                if(err)
                    callback(err,null);
                else
                    callback(null,users);
            });

        },
        getAllvendors : function(start,end,callback){

            var query = 'select id,name,phone,contact_no,created_at,status from vendors order by created_at LIMIT '+start+','+end;
            mysql_connect.query(query,function(err,vendors){

                if(err)
                    callback(err,null);
                else
                    callback(null,vendors);
            });
        }
    };
};
