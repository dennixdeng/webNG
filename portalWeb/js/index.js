'use strict';
//App section
var app=angular.module('app',['ngRoute','etFilters']).config(['$routeProvider',function($routeProvider){
        $routeProvider.
            when('/home',{templateUrl:'ui/homepage.html',controller:'homepageCtrl'}).
            when('/intro',{templateUrl:'ui/pingtai_intro.html',controller:'mainIntroCtrl'}).
            when('/subintro/:listId',{templateUrl:'ui/pingtai_intro.html',controller:'subIntroCtrl'}).
            when('/newslist/:listId',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
            when('/newslist/:listId/:listName',{templateUrl:'ui/newslist.html',controller:'newslistCtrl'}).
            when('/news/:docId',{templateUrl:'ui/news_detail.html',controller:'newsCtrl'}).
            when('/qiyefabu/',{templateUrl:'ui/qiyefabu.html',controller:'qiyefabuCtrl'}).
            when('/gaoxiaofabu/',{templateUrl:'ui/gaoxiaofabu.html',controller:'gaoxiaofabuCtrl'}).
            when('/gaoxiaofabuDetail/:docId',{templateUrl:'ui/gaoxiaoliulan.html',controller:'gaoxiaoliulanCtrl'}).
            when('/qiyefabuDetail/:docId',{templateUrl:'ui/qiyeliulan.html',controller:'qiyeliulanCtrl'}).
            when('/gaoxiaofabuList',{templateUrl:'ui/fabulist.html',controller:'gaoxiaolistCtrl'}).
            when('/qiyefabuList',{templateUrl:'ui/fabulist.html',controller:'qiyelistCtrl'}).
            when('/gaoxiaofabuSearch/:keyword',{templateUrl:'ui/fabulist.html',controller:'gaoxiaofabuSearchCtrl'}).
            when('/qiyefabuSearch/:keyword',{templateUrl:'ui/fabulist.html',controller:'qiyefabuSearchCtrl'}).
            when('/newsSearch/:keyword',{templateUrl:'ui/newslist.html',controller:'newsSearchCtrl'}).
            when('/jingjiren',{templateUrl:'ui/jingjiren.html',controller:'jingjirenCtrl'}).

            otherwise({redirectTo:'/home'});
    }]);

var Server="http://t.easytag.cn/";
//var Server="http://localhost:8881/";

//User cntroller section
var currentUser;
var showLoginScreen;
app.controller('loginScreenCtrl',function($scope,$http,$location){
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
    $scope.Go=function(path){
        $location.path(path);
    }
});

//Controllers section
app.controller('menuContoller',function($scope,$http,$location){
    $http.get('menus/topNavi.json').success(function(data){
        $scope.menuItems=data;
    });
    $scope.menuShow=function(inx){
        $scope.activeMenu=inx;
    }
    $scope.newsSearch=function(keyword){
        $location.path('/newsSearch/' + keyword );
    };
});
app.controller('homepageCtrl',function($scope,$http,$location){
    Component.http=$http;Component.scope=$scope;
    $scope.home_slide_0 = Component.newimageList('529addfb0e66761d078fe35b');
    $scope.tzgg= Component.newTextSlider('docPool',9,'52a6bb92d142e9c2ee6c90e3');
    $scope.xwdt= Component.newList(3,'529addfb0e66761d078fe35b');
    $scope.xxdt_image=Component.newList(1,'529b14ceec282bac9148ac10',true,function(){
        var docId = $scope.xxdt_image.list[0]?$scope.xxdt_image.list[0]._id:null;
        $scope.xxdt= Component.newTitleList('docPool',4,'529b14ceec282bac9148ac10',docId);
    });

    $scope.ptjz= Component.newList(5,'529b1da2ec282bac9148ac11');

    $http.get(Server + 'open/docPool/' + '52adc54c4fe150534d849cb4').success(function(d){
        $scope.ptjj= d;
    });
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
    $scope.qyfb= Component.newTitleList('qiyefabuPool',8,'all');
    $scope.gxfb= Component.newTitleList('gaoxiaofabuPool',8,'all');

    var d = document.getElementById('top_newsupdate_slider');
    function slide_top_newsupdate_slider (){
        if (d.scrollLeft <= d.scrollWidth - 1000){
            d.scrollLeft+=1;
        }else{

            d.scrollLeft = 0;
        }
    }
    setInterval(slide_top_newsupdate_slider,20);


    $scope.qiyeSearch=function(keyword){
        $location.path('/qiyefabuSearch/' +  keyword);
    };
    $scope.gaoxiaoSearch=function(keyword){
        $location.path('/gaoxiaofabuSearch/' +  keyword);
    };
});

app.controller('mainIntroCtrl',function($scope,$http,$sce){
    $http.get(Server + 'get_list/listPool?parent=52abb502b5f067da3406fb34').success(function(d){
        $scope.mainlist={list: d};
        $scope.mainlist.list.splice(0,1);
        for (var i in d){
            listMap[d[i]._id] =d[i];
            d[i].title =  d[i].name;
        }
    });
    $scope.subTitle='平台体系'; $scope.viewer="subintro";
    $http.get(Server + 'open/docPool/' + '52adc54c4fe150534d849cb4').success(function(d){
        $scope.mainDoc= d;
        for (var i in $scope.mainDoc.paraList) {
            var p = $scope.mainDoc.paraList[i];
            if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
            if ((p.attachment )&& (p.attachment.name.toLowerCase().indexOf('pdf')>0) ){
                console.log(p.attachment.name.toLowerCase().indexOf('pdf')>0);
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
            if ((p.attachment) && (p.attachment.name.toLowerCase().indexOf('pdf')>0) ){
                $scope.showPdf=true;
                var pdf = new PDFObject({ url: p.attachment.url })
                    .embed('PDFView');
            }
        }
    });
});

function createLeftBlock($scope,$http,page){
    var list=[
        {_id:'529addfb0e66761d078fe35b',name:'新闻动态',viewer:'news',inx:0},
        {_id:'52a6bb92d142e9c2ee6c90e3',name:'通知公告',viewer:'news',inx:1},
        {_id:'529b37deec282bac9148ac18',name:'下载专区',viewer:'news',inx:2},
        {_id:'529b3487ec282bac9148ac17',name:'政策法规',viewer:'news',inx:3},

        {_id:'529b14ceec282bac9148ac10',name:'信息动态',viewer:'news',inx:4},
        {_id:'529b1da2ec282bac9148ac11',name:'平台进展',viewer:'news',inx:5},
        {_id:'529b2e3bec282bac9148ac16',name:'平台通讯',viewer:'news',inx:6},

        {_id:'529b2665ec282bac9148ac13',name:'热点信息',viewer:'news',inx:7},
        {_id:'529b28feec282bac9148ac14',name:'工博会',viewer:'news',inx:8},
        {_id:'529b2c6bec282bac9148ac15',name:'其他展会',viewer:'news',inx:9},

        {_id:'529b3c53ec282bac9148ac19',name:'案例展示',viewer:'news',inx:10}
    ];
    var map={
        '529addfb0e66761d078fe35b':[0,1,2],
        '52a6bb92d142e9c2ee6c90e3':[1,0,2],
        '529b37deec282bac9148ac18':[2,3,11],
        '529b14ceec282bac9148ac10':[4,5,6],
        '529b1da2ec282bac9148ac11':[5,6,4],
        '529b2e3bec282bac9148ac16':[6,5,4],
        '529b2665ec282bac9148ac13':[7,8,9],
        '529b28feec282bac9148ac14':[8,7,9],
        '529b2c6bec282bac9148ac15':[9,8,7]
    }
    $scope.leftBlock=[];
    $scope.block=[];

    if ( (page == 'gaoxiaofabu')||(page=='qiyefabu')){
        $scope.leftBlock_1 = "ui/left_blocks/block0.html";
        $scope.leftBlock_2 = "ui/left_blocks/block1.html";
        $scope.leftBlock_3 = "ui/left_blocks/block2.html";
        var i = 3;
        $scope.block[0] = {
            category:Component.newTitleList('docPool',5,  list[i ]._id ),
            name:  list[i ].name,
            viewer:  list[i].viewer
        };
        $scope.block[1] = {
            category:Component.newTitleList('gaoxiaofabuPool',5,'all'),
            name:  '高校最新发布',
            viewer:  'gaoxiaofabuDetail'
        };
        $scope.block[2] = {
            category:Component.newTitleList('qiyefabuPool',5,'all'),
            name:  '企业最新发布',
            viewer:  'qiyefabuDetail'
        };

        $scope.mainlist= Component.newTitleList('gaoxiaofabuPool','all','all');

    }else{
        console.log(map[page]);
        $scope.leftBlock_1 = "ui/left_blocks/block0.html";
        $scope.leftBlock_2 = "ui/left_blocks/block1.html";
        $scope.leftBlock_3 = "ui/left_blocks/block2.html";
        for (var i in map[page]){
            $scope.block[i]={
                category:Component.newTitleList('docPool',5,  list[map[page][i] ]._id ),
                name:  list[map[page][i] ].name,
                viewer:  list[map[page][i] ].viewer
            };
        }
        console.log($scope.block);
    };
}

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

    createLeftBlock($scope,$http,$routeParams.listId);
});

app.controller('newsSearchCtrl',function($scope,$http,$routeParams){
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ;
        for (var i in d){
            listMap[d[i]._id] =d[i];
        }
    });
    $scope.mainlist={};
    $http.post(Server + 'keyword/docPool/all',{filter:{keyword:$routeParams.keyword}}).success(function(d){
        $scope.mainlist = d ;
        if (d){
            createLeftBlock($scope,$http,$scope.mainlist.list[0].inLists[0]);
        }else{
            createLeftBlock($scope,$http,'529addfb0e66761d078fe35b');
        }
    })
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
                if ((p.attachment) &&(p.attachment.name.toLowerCase().indexOf('pdf')>0)){
                    $scope.showPdf=true;
                    var pdf = new PDFObject({ url: p.attachment.url })
                        .embed('PDFView');
                }
            }
            createLeftBlock($scope,$http,$scope.doc.inLists[0]);
        }) ;
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
    console.log('e');
    createLeftBlock($scope,$http,'qiyefabu');
});
app.controller('gaoxiaofabuCtrl',function($scope,$http){
    if (currentUser == undefined ) showLoginScreen();
    Component.http=$http;Component.scope=$scope;
    $scope.doc={area:[],inLists:[]};
    $scope.submitDoc=function(){
        $http.post(Server + 'save/gaoxiaofabuPool',{doc:$scope.doc})
            .success(function(){
                alert('发布成功！')
                $scope.doc={area:[],inLists:[]};
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
    createLeftBlock($scope,$http,'gaoxiaofabu');
});

app.controller('gaoxiaoliulanCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/gaoxiaofabuPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
        })
    $scope.areas=["新能源","生物医药","新能源汽车","民用航空制造业","电子信息制造业","海洋工程设备","先进重大设备","软件和信息服务业","新材料","其他"]

    createLeftBlock($scope,$http,'gaoxiaofabu');
});

app.controller('qiyeliulanCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.get(Server + 'open/qiyefabuPool/' + $routeParams.docId)
        .success(function(data){
            $scope.doc=data;
        })
    createLeftBlock($scope,$http,'qiyefabu');
});
app.controller('qiyelistCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $scope.mainlist= Component.newTitleList('qiyefabuPool','all','all');
    $scope.listname='企业需求列表';
    $scope.detailPath='qiyefabuDetail';
    $scope.fabuUrl='#/qiyefabu/';

    createLeftBlock($scope,$http,'qiyefabu');
});
app.controller('gaoxiaolistCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $scope.mainlist= Component.newTitleList('gaoxiaofabuPool','all','all');
    $scope.listname='高校成果一览';
    $scope.detailPath='gaoxiaofabuDetail';
    $scope.fabuUrl='#/gaoxiaofabu/';

    createLeftBlock($scope,$http,'gaoxiaofabu');
});

app.controller('qiyefabuSearchCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.post(Server + 'keyword/qiyefabuPool/all',{filter:{keyword:$routeParams.keyword}}).success(function(d){
        $scope.mainlist = d;
    });

    $scope.listname='企业需求搜索';
    $scope.detailPath='qiyefabuDetail';
    $scope.fabuUrl='#/qiyefabu/';

    createLeftBlock($scope,$http,'qiyefabu')
});

app.controller('gaoxiaofabuSearchCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.post(Server + 'keyword/gaoxiaofabuPool/all',{filter:{keyword:$routeParams.keyword}}).success(function(d){
        $scope.mainlist = d;
    });

    $scope.listname='高校成果搜索';
    $scope.detailPath='gaoxiaofabuDetail';
    $scope.fabuUrl='#/gaoxiaofabu/';

    createLeftBlock($scope,$http,'gaoxiaofabu');
});
app.controller('jingjirenCtrl',function($scope,$http,$routeParams){
    Component.http=$http;Component.scope=$scope;
    $http.post(Server + 'keyword/gaoxiaofabuPool/all',{filter:{keyword:$routeParams.keyword}}).success(function(d){
        $scope.mainlist = d;
    });

    $scope.listname='高校成果搜索';
    $scope.detailPath='gaoxiaofabuDetail';
    $scope.fabuUrl='#/gaoxiaofabu/';

    createLeftBlock($scope,$http,'jingjirenCtrl');
});

