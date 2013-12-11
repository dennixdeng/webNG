'use strict';

var app=angular.module('app',['ngRoute','ngSanitize','etFilters','angularFileUpload']);

app.config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/home.html',controller:'homeCtrl'}).
            when('/doc/:docId',{templateUrl:'ui/doc.html',controller:'docCtrl'}).
            when('/newdoc/:listId',{templateUrl:'ui/doc.html',controller:'docCtrl'}).
            when('/newdoc/',{templateUrl:'ui/doc.html',controller:'docCtrl'}).
            when('/imageList/:listId',{templateUrl:'ui/imageList.html',controller:'imageListCtrl'}).
            when('/home',{templateUrl:'ui/home.html'}).
            when('/docList/:docListId',{templateUrl:'ui/docList.html',controller:'docListCtrl'}).
            when('/accounts',{templateUrl:'ui/accountMgm.html',controller:'accountMgmCtrl'}).
            when('/docCategory',{templateUrl:'ui/categoryMgm.html',controller:'docCategoryMgmCtrl'}).
            when('/docClass',{templateUrl:'ui/classMgm.html',controller:'docClassMgmCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);
