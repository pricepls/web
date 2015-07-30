/*Pricepls web application app.js initializing main modudle*/

var priceplsapp=angular.module('pricepls-app',['ngRoute']);

priceplsapp.config(function($routeProvider,$locationProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : './public/views/home.html',
            controller  : 'mainController'

        })
        // route for the vendor new page
        .when('/vendor-new', {
            templateUrl : 'views/vendor.html',
            controller  : 'vendorController',
            controllerAs: 'ctrl_vendor'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'views/contact.html',
            controller  : 'contactController',
            controllerAs: 'ctrl_contact'
        })
        .when('/admin', {
            templateUrl : 'views/admin_login.html',
            controller  : 'adminController',
            controllerAs: 'ctrl_admin'
        })
        .otherwise({
            redirectTo: '/'
         });

    //$locationProvider.html5Mode(true);

});

priceplsapp.controller('mainController',[function($scope){
    var self= this;

    self.email='';
    self.sendInvite=function(){

    }
}]);


