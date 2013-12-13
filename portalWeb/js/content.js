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
            when('/gaoxiaofabuDetail/:docId',{templateUrl:'ui/gaoxiaoliulan.html',controller:'gaoxiaoliulanCtrl'}).
            when('/qiyefabuDetail/:docId',{templateUrl:'ui/qiyeliulan.html',controller:'qiyeliulanCtrl'}).
            when('/gaoxiaofabuList',{templateUrl:'ui/fabulist.html',controller:'gaoxiaolistCtrl'}).
            when('/qiyefabuList',{templateUrl:'ui/fabulist.html',controller:'qiyelistCtrl'}).
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
var listMap={};
app.controller('newslistCtrl',function($scope,$http,$routeParams){
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ;
        for (var i in d){
            listMap[d[i]._id] =d[i];
        }
    });
    Component.http=$http;Component.scope=$scope;
    //$scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.mainlist= Component.newTitleList('docPool',30,$routeParams.listId);
    $scope.pages = [1,2,3,4,5];
});

app.controller('newsCtrl',function($scope,$http,$routeParams,$sce,$window){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/docPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
            if (data.redirect) {$window.location.href = data.redirectTo;}
            for (var i in $scope.doc.paraList) {
                var p = $scope.doc.paraList[i];
                if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
                if (p.attachment && p.attachment.name.toLowerCase().indexOf('pdf')){
                    var pdf = new PDFObject({ url: p.attachment.url })
                        .embed('PDFView');
                }
            }
        })
});

app.controller('qiyefabuCtrl',function($scope,$http){
    if (currentUser == undefined ) showLoginScreen();
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
    if (currentUser == undefined ) showLoginScreen();
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

app.controller('gaoxiaoliulanCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/gaoxiaofabuPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
        })
    $scope.areas=["新能源","生物医药","新能源汽车","民用航空制造业","电子信息制造业","海洋工程设备","先进重大设备","软件和信息服务业","新材料","其他"]
});

app.controller('qiyeliulanCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/qiyefabuPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
        })
});
app.controller('qiyelistCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $scope.mainlist= Component.newTitleList('qiyefabuPool','all','all');
    $scope.listname='企业需求列表';
    $scope.detailPath='qiyefabuDetail';
    $scope.fabuUrl='#/qiyefabu/';
});
app.controller('gaoxiaolistCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $scope.mainlist= Component.newTitleList('gaoxiaofabuPool','all','all');
    $scope.listname='高校成果一览';
    $scope.detailPath='gaoxiaofabuDetail';
    $scope.fabuUrl='#/gaoxiaofabu/';
});


var currentUser;
var showLoginScreen;
app.controller('loginScreenCtrl',function($scope,$http,$routeParams){
    $scope.hidelogin=true;
    $scope.login=function(){
        $http.get(Server + 'userPublic/login/' + $scope.uid + '/' + $scope.pwd).success(function(d){
            currentUser = d;
            // updateTopBar(currentUser);
            $scope.hidelogin=true;
            $scope.pwd = '';
        }).error(function(d){
                $scope.message='账号或密码有误， 请重试';
            });
    }
    showLoginScreen=function(){
        $scope.hidelogin=false;
        $scope.$apply();
    }

    $scope.showReg=false;
    $scope.showRegForm=function(){
        $scope.showReg=true;
    };
    $scope.newUser={};
    $scope.register=function(){
        if ($scope.newUser.pwd != $scope.newUser.pwd2){alert('密码不一致');return};
        $http.post(Server + 'userPublic/new/',$scope.newUser).success(function(){
            $scope.message='创建成功，立刻登录';
            $scope.showReg=false;;
        });
    }
});
