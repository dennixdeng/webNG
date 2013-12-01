'use strict';
var Server="http://115.29.179.40:8881/";

console.log('Controllers init @ svr ' + Server);
//component section
var Component={
    http:null,
    scope:null,
newimageList :function(Id){
    var obj ={};
    Component.http.get(Server +'open/imageListPool/' + Id).success(function(d){
        obj.list= d.list;
        obj.current = 0;
        obj.next=function(){
            obj.current++;
                if (obj.current >= obj.list.length) obj.current= 0;
                Component.scope.$apply();
            }
            var i=setInterval(obj.next,3000);
    });
    return obj;
    },
newList:function(Id){
    var obj={};
    Component.http.get(Server +'list/docPool/' + Id).success(function(d){
        obj.list= d;
    });
    return obj;
    }
}
//Controllers section
app.controller('menuContoller',['$scope','$http',function($scope,$http){
    $http.get('../contentService/static/menus/topNavi.json').success(function(data){
        $scope.menuItems=data;
    });
    $scope.menuShow=function(inx){
        $scope.activeMenu=inx;
    }
}]);
app.controller('homepageCtrl',['$scope','$http',function($scope,$http){
    Component.http=$http;Component.scope=$scope;
    $scope.home_slide_0 = Component.newimageList('529ac22d04e9114269849f57');
    $scope.home_list_news= Component.newList('529addfb0e66761d078fe35b');

    /*
    $scope.home_list_news=[
        {linkCaption:'上海高校技术市场、上海知识产权园迁址合作签约仪式隆重举行', linkTo:'/news/detail/asdasdf',briefPhrase:'日前，上海技术交易所组织了青浦基层驿站的40名金融机构工作人员参加了青浦基层驿站的40名金融机构工作人员参加了2013年上海市执业技术经纪人培训...'},
        {linkCaption:'上海高校技术市场、上海知识产权园迁址合作签约', linkTo:'/news/detail/!@!!#!!@!',briefPhrase:'日前，上海技术交易所组织了青浦基层驿站的40名金融机构工作人员参加了青浦基层驿站的40名金融机构工作人员参加了2013年上海市执业技术经纪人培训...'},
        {linkCaption:'上海高校技术市场、上海知识产权园迁址合作签约仪式隆重举行', linkTo:'/news/detail/ADADDEDSD',briefPhrase:'日前，上海技术交易所组织了青浦基层驿站的40名金融机构工作人员参加了2013年上海市执业技术经纪人培训...'}
    ];
    */
}]);
/*
app.controller('homeCtrl',['$scope','$routeParams','$http',
    function($scope,$routeParams,$http){
        $scope.list_home_img_slider_0={current:0,list:[]};
        $scope.list_home_img_slider_0.next=function(){
            $scope.list_home_img_slider_0.current++;
            if ($scope.list_home_img_slider_0.current >= $scope.list_home_img_slider_0.list.length) $scope.list_home_img_slider_0.current=0;
            $scope.$apply();
        }
        $http.get('http://localhost:8881/get_list_by_tag/home_page_image').success(function(data) {
            $scope.list_home_img_slider_0.list = data.ok;
        });
        setInterval($scope.list_home_img_slider_0.next,5000);

        $scope.friends=[
            {name:'John', phone:'555-1212', age:10, gifts:[{name:'Gift AAAA'},{name:'Beeess'},{name:'Funn'}]},
            {name:'Mary', phone:'555-9876', age:19, gifts:[{name:'Gift BBBB'},{name:'Beeess'},{name:'Funn'}]},
            {name:'Mike', phone:'555-4321', age:21, gifts:[{name:'Gift CCCCC'},{name:'Beeess'},{name:'Funn'}]},
            {name:'Adam', phone:'555-5678', age:35, gifts:[{name:'Gift DDDDD'},{name:'Beeess'},{name:'Funn'}]},
            {name:'Julie', phone:'555-8765', age:29, gifts:[{name:'Gift EEEE'},{name:'Beeess'},{name:'Funn'}]}
        ];

        $scope.set_list_home_news_0_active=function(index){
            $scope.list_home_news_0_active = index;
        }
    }
]);
*/
//Filters section
angular.module('etFilters', []).filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});

angular.module('etFilters', []).filter('docBrief', function() {
    return function(doc) {
        var brief='';
        for (var i in doc.paraList){
            if( doc.paraList[i].html ) {
                brief += doc.paraList[i].html.raw.replace(/<[^>]*>/g, "");
            }
        }
        return brief.substr(0,150);
    };
});

