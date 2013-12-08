'use strict';
//App section
var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/newslist/:listId/:listName',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
            when('/news/:docId',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            when('/intro/:docId',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            when('/qiyefabu/',{templateUrl:'ui/qiyefabu.html',controller:'qiyefabuCtrl'}).
            when('/gaoxiaofabu/',{templateUrl:'ui/gaoxiaofabu.html',controller:'gaoxiaofabuCtrl'}).
            otherwise({redirectTo:'/home'});
    }]);

'use strict';
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
app.controller('leftContoller',['$scope','$http',function($scope,$http){
    Component.http=$http;Component.scope=$scope;
    $scope.xwdt= Component.newTitleList('docPool',5,'529addfb0e66761d078fe35b');
    $scope.qyfb= Component.newTitleList('qiyefabuPool',5,'all');
    $scope.gxfb= Component.newTitleList('gaoxiaofabuPool',5,'all');
}]);
app.controller('newslistCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $scope.name=$routeParams.listName;
    //$scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.mainlist= Component.newTitleList('docPool',30,$routeParams.listId);
});

app.controller('newsCtrl',function($scope,$http,$routeParams,$sce){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/docPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
            for (var i in $scope.doc.paraList) {
                var p = $scope.doc.paraList[i];
                if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
            }
        })
});

app.controller('qiyefabuCtrl',function($scope,$http){
    Component.http=$http;Component.scope=$scope;
    $scope.doc={};
    $scope.submitDoc=function(){
        $http.post(Server + 'save/qiyefabuPool',{doc:$scope.doc})
            .success(function(){
                alert('发布成功！')
                $scope.doc={};
            });
    };
});
app.controller('gaoxiaofabuCtrl',function($scope,$http){
    Component.http=$http;Component.scope=$scope;
    $scope.doc={areas:[]};
    $scope.submitDoc=function(){
        $http.post(Server + 'save/gaoxiaofabuPool',{doc:$scope.doc})
            .success(function(){
                alert('发布成功！')
                $scope.doc={};
            });
    };
});