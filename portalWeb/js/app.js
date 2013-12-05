'use strict';

var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/homepage.html',controller:'homepageCtrl'}).
            when('/newslist/:listId/:listName',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
            when('/news/:docId',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            when('/intro/staff',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            when('/qiyefabu/',{templateUrl:'ui/qiyefabu.html',controller:'qiyefabuCtrl'}).
            when('/gaoxiaofabu/',{templateUrl:'ui/gaoxiaofabu.html',controller:'gaoxiaofabuCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);
