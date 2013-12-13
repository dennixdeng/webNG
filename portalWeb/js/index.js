'use strict';
//App section
var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/homepage.html',controller:'homepageCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);

var Server="http://t.easytag.cn/";
//var Server="http://localhost:8881/";

//Controllers section
app.controller('menuContoller',['$scope','$http',function($scope,$http){
    $http.get('menus/topNavi.json').success(function(data){
        $scope.menuItems=data;
    });
    $scope.menuShow=function(inx){
        $scope.activeMenu=inx;
    }
}]);
app.controller('homepageCtrl',['$scope','$http',function($scope,$http){
    Component.http=$http;Component.scope=$scope;
    $scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.tzgg= Component.newTextSlider('docPool',9,'52a6bb92d142e9c2ee6c90e3');
    $scope.xwdt= Component.newList(3,'529addfb0e66761d078fe35b');
    $scope.xxdt= Component.newList(4,'529b14ceec282bac9148ac10');
    $scope.ptjz= Component.newList(5,'529b1da2ec282bac9148ac11');
    $scope.ptjj= Component.newList(1,'529b22dcec282bac9148ac12');
    $scope.rdxx= Component.newList(4,'529b2665ec282bac9148ac13');
    $scope.gbh = Component.newList(5,'529b28feec282bac9148ac14');
    $scope.qtzh= Component.newList(5,'529b2c6bec282bac9148ac15');
    $scope.pttx= Component.newList(8,'529b2e3bec282bac9148ac16');
    $scope.zcfg= Component.newTitleList('docPool',9,'529b3487ec282bac9148ac17');
    $scope.xzzq= Component.newTitleList('docPool',9,'529b37deec282bac9148ac18');
    $scope.alzs= Component.newList(5,'529b3c53ec282bac9148ac19');
    $scope.qyfb= Component.newTitleList('qiyefabuPool',7,'all');
    $scope.gxfb= Component.newTitleList('gaoxiaofabuPool',7,'all');

    var d = document.getElementById('top_newsupdate_slider');
    function slide_top_newsupdate_slider (){
        if (d.scrollLeft <= d.scrollWidth - 1000){
            d.scrollLeft+=1;
        }else{

            d.scrollLeft = 0;
        }
    }
    setInterval(slide_top_newsupdate_slider,20);
}]);
