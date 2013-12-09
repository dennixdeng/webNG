'use strict';
//App section
var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/newslist/:listId/:listName',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
            when('/newslist/:listId',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
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
    //$scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.mainlist= Component.newTitleList('docPool',30,$routeParams.listId);
    $scope.pages = [1,2,3,4,5];
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
    $scope.doc={inLists:[]};
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
    $scope.doc={area:[],inLists:[]};
    $scope.submitDoc=function(){
        $http.post(Server + 'save/gaoxiaofabuPool',{doc:$scope.doc})
            .success(function(){
                alert('发布成功！')
                $scope.doc={};
            });
    };
    $scope.areas=["新能源","生物医药","新能源汽车","民用航空制造业","电子信息制造业","海洋工程设备","先进重大设备","软件和信息服务业","新材料","其他"]
    $scope.toggleArea=function(inx){
        var pos =  $scope.doc.area.indexOf($scope.areas[inx]);
        if ( pos > -1 ){
            $scope.doc.area.splice(pos,1);
        }else{
            $scope.doc.area.push($scope.areas[inx]);
        }
    }
});