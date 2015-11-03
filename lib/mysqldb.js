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
        newAdmin:function(name,phone,password,callback){

            var query = 'insert into admins (name,phone,password,created_at,status) values ("'+name+'","'+phone+'","'+password+'",NOW(),"active")';
            mysql_connect.query(query,function(err,success){
                if(err)
                    callback(err,null);
                else{
                    callback(null,success);
                }
            });
        },
        newCity : function (name,id,callback){

            var query = 'insert into cities (name,country_id,created_date,status) values("'+name+'","'+id+'",NOW(),"active")';
            mysql_connect.query(query,function(err,success){
                if(err)
                    callback(err,null);
                else{
                    callback(null,success);
                }
            });
        },
        addAmenity :function(name,callback){

            var query = 'insert into amenities (name) VALUES ("'+name+'")';
            mysql_connect.query(query,function(err,success){
                if(err)
                    callback(err);
                else
                    callback(null,success);
            });
        },
        getCities:function(callback){

            var country =1; //TODO change it wen multi countries are implementing

            var query = 'select id,name from cities where country_id = ?';
            mysql_connect.query(query,[country],function(err,cities){

                if(err)
                    callback(err);
                else
                    callback(null,cities);

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
        },
        getCategories : function(callback){

            var query = 'select id , name , sub_type from category where status ="active"';
            mysql_connect.query(query,function(err,categories){
                if(err)
                    callback(err,null);
                else
                    callback(null,categories);
            });
        },
        getAmenities : function(callback){

            var query = 'select * from amenities';
            mysql_connect.query(query,function(err,amenities){

                if(err)
                    callback(err,null);
                else
                    callback(null,amenities);
            });
        },
        newVendor:function(phone,password,contact_no,name,callback){

            var query = 'insert into vendors (name,phone,password,contact_no,created_at,status) values ("'+name+'","'+phone+'","'+password+'","'+contact_no+'",NOW(),"active")';
            mysql_connect.query(query,function(err,success){

                if(err)
                    callback(err,null);
                else
                    callback(null,success);
            });
        },
        getAlladmins : function(callback){

            var query = 'select id,name,phone,status from admins';
            mysql_connect.query(query,function(err,admins){

                if(err)
                    callback(err,null);
                else
                    callback(null,admins);
            })
        },
        getAllcities :  function(callback){

            var query = 'select c.id,c.name,c.country_id ,c.status,con.name as c_name from cities c INNER JOIN country con ON c.country_id = con.id';
            mysql_connect.query(query,function(err,cities){

                if(err)
                    callback(err,null);
                else

                    callback(null,cities);
            })
        },
        getAllamenities:  function(callback){

            var query = 'select id,name from amenities';
            mysql_connect.query(query,function(err,amenities){

                if(err)
                    callback(err,null);
                else
                    callback(null,amenities);
            })
        },
        getAllcategories :function(callback){

            var query = 'select id,name,sub_type from category';
            mysql_connect.query(query,function(err,categories){

                if(err)
                    callback(err,null);
                else
                    callback(null,categories);
            })
        },
        getAllareas : function(callback){

            var query = 'select id,name,city_id from areas';
            mysql_connect.query(query,function(err,areas){

                if(err)
                    callback(err,null);
                else
                    callback(null,areas);
            })
        }

    };
};
