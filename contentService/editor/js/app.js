'use strict';

var app=angular.module('app',['ngRoute','ngSanitize','etFilters','angularFileUpload']);

app.config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/home.html',controller:'homeCtrl'}).
            when('/doc/:docId',{templateUrl:'ui/doc.html',controller:'docCtrl'}).
            when('/imageList/:listId',{templateUrl:'ui/imageList.html',controller:'imageListCtrl'}).
            when('/docList/:listId',{templateUrl:'ui/docList.html',controller:'docListCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);
