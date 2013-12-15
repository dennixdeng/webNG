'use strict';
//App section
var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/homepage.html',controller:'homepageCtrl'}).
            when('/intro',{templateUrl:'ui/pingtai_intro.html',controller:'mainIntroCtrl'}).
            when('/subintro/:listId',{templateUrl:'ui/pingtai_intro.html',controller:'subIntroCtrl'}).
            when('/news/:docId',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);

//var Server="http://t.easytag.cn/";
var Server="http://localhost:8881/";

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
    $scope.xxdt_image=Component.newList(1,'529b14ceec282bac9148ac10',true,function(){
        var docId = $scope.xxdt_image.list[0]?$scope.xxdt_image.list[0]._id:null;
        $scope.xxdt= Component.newTitleList('docPool',4,'529b14ceec282bac9148ac10',docId);
    });

    $scope.ptjz= Component.newList(5,'529b1da2ec282bac9148ac11');
    $scope.ptjj= Component.newList(1,'529b22dcec282bac9148ac12');
    $scope.rdxx_image= Component.newList(1,'529b2665ec282bac9148ac13',true,function(){
        var docId = $scope.rdxx_image.list[0]?$scope.rdxx_image.list[0]._id:null;
        $scope.rdxx= Component.newTitleList('docPool',4,'529b2665ec282bac9148ac13',docId);
    });
    $scope.gbh = Component.newList(5,'529b28feec282bac9148ac14');
    $scope.qtzh= Component.newList(5,'529b2c6bec282bac9148ac15');
    $scope.pttx= Component.newList(8,'529b2e3bec282bac9148ac16');
    $scope.zcfg_image= Component.newList(1,'529b3487ec282bac9148ac17',true,function(){
        var doc = $scope.zcfg_image.list[0]||{};
        $scope.zcfg= Component.newTitleList('docPool',8,'529b3487ec282bac9148ac17',doc._id);
    });
    $scope.xzzq_image= Component.newList(1,'529b37deec282bac9148ac18',true,function(){
        var doc = $scope.xzzq_image.list[0]||{};
        $scope.xzzq= Component.newTitleList('docPool',8,'529b37deec282bac9148ac18',doc._id);
    });
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

app.controller('mainIntroCtrl',function($scope,$http,$sce){
    $http.get(Server + 'get_list/listPool?parent=52abb502b5f067da3406fb34').success(function(d){
        $scope.mainlist={list: d};
        for (var i in d){
            listMap[d[i]._id] =d[i];
            d[i].title =  d[i].name;
        }
    });
    $scope.subTitle='平台体系列表'; $scope.viewer="subintro";
    $http.get(Server + 'open/docPool/' + '52ac0439150f3487ab2f8b1c').success(function(d){
        $scope.mainDoc= d;
        for (var i in $scope.mainDoc.paraList) {
            var p = $scope.mainDoc.paraList[i];
            if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
            if (p.attachment && p.attachment.name.toLowerCase().indexOf('pdf')){
                $scope.showPdf=true;
                var pdf = new PDFObject({ url: p.attachment.url })
                    .embed('PDFView');
            }
        }
    });

});

app.controller('subIntroCtrl',function($scope,$http,$routeParams,$sce){
    Component.http=$http;Component.scope=$scope;
    //$scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.mainlist= Component.newTitleList('docPool',30,$routeParams.listId);
    $scope.subTitle='平台动态'; $scope.viewer="news";
    $http.get(Server + 'open/docPool/' + $routeParams.listId).success(function(d){
        $scope.mainDoc= d;
        for (var i in $scope.mainDoc.paraList) {
            var p = $scope.mainDoc.paraList[i];
            if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
            if (p.attachment && p.attachment.name.toLowerCase().indexOf('pdf')){
                $scope.showPdf=true;
                var pdf = new PDFObject({ url: p.attachment.url })
                    .embed('PDFView');
            }
        }
    });
});
