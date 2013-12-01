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
newList:function(top,Id){
    var obj={};
    Component.http.get(Server +'list/docPool/'+top + '/' + Id).success(function(d){
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
    $scope.home_list_news= Component.newList(3,'529addfb0e66761d078fe35b');
    $scope.xxdt= Component.newList(4,'529b14ceec282bac9148ac10');
    $scope.ptjz= Component.newList(5,'529b1da2ec282bac9148ac11');
    $scope.ptjj= Component.newList(1,'529b22dcec282bac9148ac12');
    $scope.rdxx= Component.newList(4,'529b2665ec282bac9148ac13');
    $scope.gbh = Component.newList(5,'529b28feec282bac9148ac14');
    $scope.qtzh= Component.newList(5,'529b2c6bec282bac9148ac15');
    $scope.pttx= Component.newList(8,'529b2e3bec282bac9148ac16');
    $scope.zcfg= Component.newList(9,'529b3487ec282bac9148ac17');
    $scope.xzzq= Component.newList(9,'529b37deec282bac9148ac18');
    $scope.alzs= Component.newList(9,'529b3c53ec282bac9148ac19');
}]);

//Filters section
angular.module('etFilters', [])
  .filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
}).filter('docBrief', function() {
    return function(doc,len) {
        if (!doc) return null;
        var brief='';
        var l=len||150;
        for (var i in doc.paraList){
            if( doc.paraList[i].html ) {
                brief += doc.paraList[i].html.raw.replace(/<[^>]*>/g, "");
            }
        }
        return brief.substr(0,len);
    };
}).filter('docImage', function() {
    return function(doc,inx) {
        if (!doc) return null;
        var imgInx=inx||0;
        for (var i in doc.paraList){
            if( doc.paraList[i].image ) {
                if ( 0 == imgInx){
                    return doc.paraList[i].image.url;
                }else{
                    imgInx--;
                }
            }
        }
        return null;
    };
}).filter('listSeg', function() {
    return function(list,start,len) {
        if(!list) return null;
        var s=start||0;
        var l=len||list.length;
        return list.slice(s,s+l);
    };
}).filter('stringLeft', function() {
    return function(src,len) {
        if(!src) return null;
        if (src.length > len){
            return src.slice(0,len) + '...';
        }else{
            return src;
        }
    };
})

