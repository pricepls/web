"use stric";

var mysql = require('mysql');
var configs = app.get('configs');


module.exports = function () {

    var mysql_connect;

    return {

        init: function () {

            mysql_connect = mysql.createConnection({
                host: configs.mysql.host,
                user: configs.mysql.user,
                password: configs.mysql.password,
                database: 'pricepls'
            });
            mysql_connect.connect(function (err) {

                if (err)
                    console.log(err);
            });
        },
        newAdmin: function (name, phone, password, callback) {

            var query = 'insert into admins (name,phone,password,created_at,status) values ("' + name + '","' + phone + '","' + password + '",NOW(),"active")';
            mysql_connect.query(query, function (err, success) {
                if (err)
                    callback(err, null);
                else {
                    callback(null, success);
                }
            });
        },
        newCounty: function (name, short, callback) {


            var query = 'select id from country where name=?';
            mysql_connect.query(query, [name], function (err, country) {

                if (err)
                    callback(err, null);
                else if (country.length > 0) {
                    callback(null, country[0].id);

                } else {

                    var query = 'insert into country (name,short,status) values("' + name + '","' + short + '","active")';
                    mysql_connect.query(query, function (err, success) {
                        if (err)
                            callback(err, null);
                        else {
                            callback(null, success.insertId);
                        }
                    });
                }

            });
        },
        newState: function (name, short, country, callback) {

            var query = 'select id from states where name=? and country_id=?';
            mysql_connect.query(query, [name, country], function (err, state) {

                if (err)
                    callback(err, null);
                else if (state.length > 0) {

                    callback(null, state[0].id);

                } else {

                    var query = 'insert into states (name,short,country_id) values("' + name + '","' + short + '","' + country + '")';
                    mysql_connect.query(query, function (err, success) {
                        if (err)
                            callback(err, null);
                        else {
                            callback(null, success.insertId);
                        }
                    });
                }

            });

        },
        newCity: function (name, id, state_id, callback) {

            var query = 'select id from cities where name=? and country_id=?';
            mysql_connect.query(query, [name, id], function (err, city) {

                if (err)
                    callback(err, null);
                else if (city.length > 0) {
                    callback(null, city[0].id);

                } else {

                    var query = 'insert into cities (name,country_id,state_id,created_date,status) values("' + name + '","' + id + '","' + state_id + '",NOW(),"active")';
                    mysql_connect.query(query, function (err, success) {
                        if (err)
                            callback(err, null);
                        else {
                            callback(null, success.insertId);
                        }
                    });
                }

            });
        },
        addAmenity: function (name, callback) {

            var query = 'insert into amenities (name) VALUES ("' + name + '")';
            mysql_connect.query(query, function (err, success) {
                if (err)
                    callback(err);
                else
                    callback(null, success);
            });
        },
        getCities: function (callback) {

            var country = 1; //TODO change it wen multi countries are implementing

            var query = 'select id,name from cities where country_id = ?';
            mysql_connect.query(query, [country], function (err, cities) {

                if (err)
                    callback(err);
                else
                    callback(null, cities);

            });
        },
        insertInvite: function (email, callback) {

            var query = 'INSERT INTO invites (email,created_date) VALUES ("' + email + '",NOW())';
            mysql_connect.query(query, function (err, success) {

                if (err)
                    callback(err, null);
                else
                    callback(null, success);

            });
        },
        checkEmailExists: function (email, callback) {

            var query = ' select count(id) as count from invites where email = ?';
            mysql_connect.query(query, [email], function (err, count) {

                if (err)
                    callback(err, null);
                else {

                    if (count[0]['count'] > 0) {

                        callback(null, true);

                    } else {

                        callback(null, false);

                    }

                }
            });
        },
        findAdmin: function (phone, password, callback) {
            var query = 'select id,name from admins where phone=? and password=? and status=\'active\'';
            mysql_connect.query(query, [phone, password], function (err, admin) {

                if (err)
                    callback(err, null);
                else {

                    if (admin.length > 0) {

                        callback(null, admin[0]);
                    } else {
                        callback(null, undefined);
                    }

                }

            });
        },
        getVendorsCount: function (callback) {

            var query = 'select count(id) as count from vendors where created_at = CURDATE()';
            mysql_connect.query(query, function (err, count) {

                if (err)
                    callback(err, null);
                else
                    callback(null, count[0]['count']);

            });
        },
        getUsersCount: function (callback) {

            var query = 'select count(id) as count from users where created_date = CURDATE() ';
            mysql_connect.query(query, function (err, count) {

                if (err)
                    callback(err, null);
                else
                    callback(null, count[0]['count']);
            });

        },
        getAllusers: function (start, end, callback) {

            var query = 'select id,phone,name,email,status,created_date from users order by created_date LIMIT ' + start + ',' + end;
            mysql_connect.query(query, function (err, users) {

                if (err)
                    callback(err, null);
                else
                    callback(null, users);
            });

        },
        getAllvendors: function (start, end, callback) {

            var query = 'select id,name,phone,contact_no,created_at,status from vendors order by created_at LIMIT ' + start + ',' + end;
            mysql_connect.query(query, function (err, vendors) {

                if (err)
                    callback(err, null);
                else
                    callback(null, vendors);
            });
        },
        getVendorByPhone: function (phone, callback) {

            var query = "select id from vendors where phone = ? ";
            mysql_connect.query(query, [phone], function (err, vendor) {

                if (err)
                    callback(err, null);
                else {
                    if (vendor.length > 0)
                        callback(null, vendor[0].id);
                    else
                        callback(null, null);
                }
            })

        },
        getVendorById: function (id, callback) {

            var query = "select id,name,contact_no,email,status from vendors where id = ? ";
            mysql_connect.query(query, [id], function (err, vendor) {

                if (err)
                    callback(err, null);
                else {
                    if (vendor.length > 0)
                        callback(null, vendor[0]);
                    else
                        callback(null, null);
                }
            })

        },
        getCategories: function (callback) {

            var query = 'select id , name , sub_type from category where status ="active"';
            mysql_connect.query(query, function (err, categories) {
                if (err)
                    callback(err, null);
                else
                    callback(null, categories);
            });
        },
        getAmenities: function (callback) {

            var query = 'select * from amenities';
            mysql_connect.query(query, function (err, amenities) {

                if (err)
                    callback(err, null);
                else
                    callback(null, amenities);
            });
        },
        newVendor: function (phone, password, contact_no, name, email, callback) {

            var query = 'insert into vendors (name,phone,password,contact_no,email,created_at,status) values ("' + name + '","' + phone + '","' + password + '","' + contact_no + '","' + email + '",NOW(),"active")';
            mysql_connect.query(query, function (err, success) {

                if (err)
                    callback(err, null);
                else
                    callback(null, success);
            });
        },
        getAlladmins: function (callback) {

            var query = 'select id,name,phone,status from admins';
            mysql_connect.query(query, function (err, admins) {

                if (err)
                    callback(err, null);
                else
                    callback(null, admins);
            })
        },
        getAllcities: function (callback) {

            var query = 'select c.id,c.name,c.country_id ,c.status,con.name as c_name from cities c INNER JOIN country con ON c.country_id = con.id';
            mysql_connect.query(query, function (err, cities) {

                if (err)
                    callback(err, null);
                else

                    callback(null, cities);
            })
        },
        getAllamenities: function (callback) {

            var query = 'select id,name from amenities';
            mysql_connect.query(query, function (err, amenities) {

                if (err)
                    callback(err, null);
                else
                    callback(null, amenities);
            })
        },
        getAllcategories: function (callback) {

            var query = 'select id,name,sub_type from category';
            mysql_connect.query(query, function (err, categories) {

                if (err)
                    callback(err, null);
                else
                    callback(null, categories);
            })
        },
        getAllareas: function (callback) {

            var query = 'select id,name,city_id from areas';
            mysql_connect.query(query, function (err, areas) {

                if (err)
                    callback(err, null);
                else
                    callback(null, areas);
            })
        }

    };
};
