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
        when('/allDocs',{templateUrl:'ui/AllDocsList.html',controller:'AllDocsCtrl'}).
        when('/docList/:docListId',{templateUrl:'ui/docList.html',controller:'docListCtrl'}).
        when('/accounts',{templateUrl:'ui/accountMgm.html',controller:'accountMgmCtrl'}).
        when('/docCategory',{templateUrl:'ui/categoryMgm.html',controller:'docCategoryMgmCtrl'}).
        when('/docClass',{templateUrl:'ui/classMgm.html',controller:'docClassMgmCtrl'}).
        when('/publicAccout',{templateUrl:'ui/publicAccount.html',controller:'publicAccoutCtrl'}).
        when('/fabu',{templateUrl:'ui/fabu.html',controller:'fabuCtrl'}).

        otherwise({redirectTo:'/home'});
}]);


var autoRefresh; //The global auto refresh timer. make sure clear it before new one created.
//Controllers section

app.controller('homeCtrl',['$scope','$http',function($scope,$http){

}]);

var Server="http://t.easytag.cn/";
//var Server="http://localhost:8881/";
var listMap={};
app.controller('AllDocsCtrl',function($scope,$http,$routeParams,$window){
    $http.get(Server + 'get_list/listPool').success(function(d){
        for (var i in d){
            listMap[d[i]._id] =d[i];
        }
    });
    $scope.docList={fromList:{name:'ttt'}};
    var loadList=function(keyword){
        $http.post(Server + 'keyword/docPool/all',{filter:{keyword:keyword}}).success(function(d){
            $scope.docList.list= d.list ;
        });
    }
    loadList('');
    $scope.searchByKeyword=function(){
        loadList($scope.keyword);
    }
    $scope.removeDoc=function(inx){
        if ($window.confirm('确定要删除文档《' +  $scope.docList.list[inx].title + '》？')){
            $http.get(Server + 'remove/docPool/' + $scope.docList.list[inx]._id).success(function(d){
                $scope.docList.list.splice(inx,1);
            });
        };
    }
});

app.controller('docListCtrl',function($scope,$http,$routeParams,$window){
    $scope.docList={fromList:{name:'ttt'}};
    var loadList=function(listId){
        if ('noListDocs' == listId){
            $http.get(Server + 'list_title/docPool/all/none').success(function(d){
                $scope.docList.list= d.list ;
                $scope.docList.fromList= {name:'草稿箱'} ;
            });
        }else{
            $http.get(Server + 'list_title/docPool/all/' + listId).success(function(d){
                $scope.docList.list= d.list ;
                $scope.docList.fromList= d.fromList ;
            });
        }
    }
    loadList($routeParams.docListId);
    clearInterval(autoRefresh);
    autoRefresh = setInterval(loadList,5000,$routeParams.docListId);

    $scope.removeDoc=function(inx){
        if ($window.confirm('确定要删除文档《' +  $scope.docList.list[inx].title + '》？')){
            $http.get(Server + 'remove/docPool/' + $scope.docList.list[inx]._id).success(function(d){
                $scope.docList.list.splice(inx,1);
            });
        };
    }
});


var currentUser;
var updateTopBar;
var showLoginScreen;
app.controller('loginScreenCtrl',function($scope,$http,$routeParams,$window){
     if (localStorage.getItem('userInfo')){
         $scope.hidelogin=true;
         currentUser = JSON.parse(localStorage.getItem('userInfo'));
         updateTopBar(currentUser);
     }
     $scope.login=function(){
         $http.get(Server + 'user/login/' + $scope.uid + '/' + $scope.pwd).success(function(d){
              currentUser = d;
             localStorage.setItem('userInfo',JSON.stringify(d));
             updateTopBar(currentUser);
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
});

app.controller('topBarCtrl',function($scope,$http,$routeParams,$window){
    $scope.serverMessage='HTML5技术全新支持，建议使用较新版浏览器';
    updateTopBar=function(usr){
          $scope.user = usr;
          $scope.$apply();
    };
    $scope.logOut=function(){
        $scope.user = currentUser = {};
        localStorage.removeItem('userInfo');
        showLoginScreen();
    }
});

app.controller('naviPanelCtrl',function($scope,$http,$routeParams,$location,$filter){
    $scope.loadCategory=function(){
        $scope.slowShow = false;
        $http.get(Server + 'get_list/parentPool').success(function(dp){
            $scope.parents=dp;
            $http.get(Server + 'get_list/listPool').success(function(d){
                $scope.allLists=d;
                for (var j in $scope.parents){
                    $scope.parents[j].childCount=0;
                    $scope.parents[j].children=[];
                    for (var i in d) if ($scope.parents[j]._id == $scope.allLists[i].parent) {
                        $scope.parents[j].childCount++;
                        $scope.parents[j].children.push( $scope.allLists[i]);
                    }
                }
            });
        });
    };
    $scope.loadCategory();
    $scope.expanded=[];
    $scope.toggleParent=function(inx){
        if ($scope.expanded[inx]){
            $scope.expanded[inx] = false;
        }else{
            $scope.expanded[inx] = true;
        }
    };

    $http.get(Server + 'get_list/fabustatusPool').success(function(d){
        $scope.statuses=d ;
    });
    $scope.btn=function(name){ $scope.aBtn = name;};
    $scope.docList=function(listId){
            $location.path('/docList/' +  listId);
    }
    $scope.fabu=function(statusId){
        $location.path('/docList/' +  statusId);
    }
    $scope.Go=function(path){
        $location.path(path);
    }
});

app.controller('accountMgmCtrl',function($scope,$http,$routeParams,$window){
    var loadUsers=function(){
        $http.get(Server + 'getUserList/').success(function(d){
            $scope.userList = d;
        });
    }
    loadUsers();
    $scope.filter={acl:{}};
    $scope.filterUser=function(){
        $http.post(Server    + 'filterUser',{filter:$scope.filter}).success(function(d){
            $scope.userList = d.list;
        });
    };
    $scope.loadCategory=function(){
        $scope.slowShow = false;
        $http.get(Server + 'get_list/parentPool').success(function(dp){
            $scope.parents=dp ;
            $http.get(Server + 'get_list/listPool').success(function(d){
                $scope.allLists=d ;
                for (var j in $scope.parents){
                    $scope.parents[j].childCount=0;
                    $scope.parents[j].children=[];
                    for (var i in d) if ($scope.parents[j]._id == $scope.allLists[i].parent) {
                        $scope.parents[j].childCount++;
                        $scope.parents[j].children.push( $scope.allLists[i]);
                    }
                }
            });
        });
    };
    $scope.loadCategory();
    $scope.expanded={};
    $scope.toggleParent=function(inx){
        if ($scope.expanded[inx]){
            $scope.expanded[inx] = false;
        }else{
            $scope.expanded[inx] = true;
        }
    };
    $scope.show='';
    $scope.newUserForm=function(){
        $scope.newUser={acl:{}};
        $scope.show='newUserForm';
    }

    $scope.filterUserForm=function(){
        $scope.filter={acl:{}};
        $scope.show='filterUserForm';
    }

    $scope.createUser=function(){
        if (!$scope.newUser.name || $scope.newUser.name==''){alert('请输入用户姓名');return ;}
        if (!$scope.newUser.uid||$scope.newUser.uid=='') {alert('请输入用户email   ');return ;}
        $http.post(Server + 'user/new/',$scope.newUser).success(function(d){
            $scope.show='';
            loadUsers();
        });
    };

    $scope.showUser={};
    $scope.expandUser=function(id){
        $scope.showUser[id]=!$scope.showUser[id];
    }
    $scope.updateACL=function(user,aclItem){
        console.log(user.acl[aclItem]);
        console.log(user.acl);
        $http.post(Server + 'setACL',{_id:user._id,item:aclItem, value: user.acl[aclItem]}).success(function(d){
        });
    }
});
app.controller('docCategoryMgmCtrl',function($scope,$http,$routeParams,$location){
    $scope.loadCategory=function(){
        $scope.slowShow = false;
        $http.get(Server + 'get_list/parentPool').success(function(dp){
            $scope.parents=dp ;
            $http.get(Server + 'get_list/listPool').success(function(d){
                $scope.allLists=d ;
                for (var j in $scope.parents){
                    $scope.parents[j].childCount=0;
                    $scope.parents[j].children=[];
                    for (var i in d) if ($scope.parents[j]._id == $scope.allLists[i].parent) {
                        $scope.parents[j].childCount++;
                        $scope.parents[j].children.push( $scope.allLists[i]);
                    }
                }
            });
        });
    };
    $scope.loadCategory();

    $scope.newClasses=[];
    $scope.creatClass=function(){
        $scope.newClasses.push({name:''});
    }
    $scope.addClass=function(inx){
        if ($scope.newClasses[inx].parent == null ) {
            alert('请选择所在大类！');
            return;
        }
        if ($scope.newClasses[inx].name == '' ) {
            alert('请输入栏目名称！');
            return;
        }
        $http.post(Server + 'save/listPool',{doc:$scope.newClasses[inx]}).success(function(d){
            $scope.loadCategory();
            $scope.newClasses.splice(inx,1);
        });
    }
    $scope.deleteClass=function(_id){
        $http.get(Server + 'remove/listPool/' + _id).success(function(){
            $scope.loadCategory();
        });
    }
    $scope.updateClass=function(cat){
        console.log(cat);
        var newName;
        if (newName = window.prompt('请输入新的栏目名')){
            cat.name=newName;
            $http.post(Server + 'save/listPool',{doc:cat}).success(function(){
                $scope.loadCategory();
            });
        }
    }
    $scope.expanded=[];
    $scope.toggleParent=function(inx){
        $scope.slowShow = true;
        if ($scope.expanded[inx]){
            $scope.expanded[inx] = false;
        }else{
            $scope.expanded[inx] = true;
        }
    };
});

app.controller('docClassMgmCtrl',function($scope,$http,$routeParams,$location){
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ;
    });
    $scope.newClasses=[];
    $scope.creatClass=function(){
        $scope.newClasses.push({name:''});
    }
    $scope.addClass=function(inx){
        $scope.newClasses[inx].parent='类别';
        $scope.allLists.push($scope.newClasses[inx]);
        $scope.newClasses.splice(inx,1);
    }
});

app.controller('publicAccoutCtrl',function($scope,$http,$routeParams,$location){

    $scope.filter={};
    $scope.filterUser=function(){
        $http.post(Server + 'userPublic/filter',{filter:$scope.filter}).success(function(d){
            $scope.userList = d;
        });
    };
    $scope.setStatus=function(inx,status){
        $http.post(Server + 'userPublic/setStaus',{_id:$scope.userList[inx]._id,status:status}).success(function(d){
            $scope.userList.splice(inx,1);
        });
    }
});

app.controller('fabuCtrl',function($scope,$http,$routeParams,$window){
    $scope.gaoxiaoList={name:'高校发布信息'};
    $scope.qiyeList={name:'企业发布信息'};
    $scope.filter={};
    $scope.gaoxiaofabusetStatus=function(inx,status){
        $http.post(Server + 'gaoxiaofabu/setStaus',{_id:$scope.gaoxiaoList.list[inx]._id,status:status}).success(function(d){
            $scope.gaoxiaoList.list.splice(inx,1);
        });
    };
    $scope.qiyefabusetStatus=function(inx,status){
        $http.post(Server + 'qiyefabu/setStaus',{_id:$scope.qiyeList.list[inx]._id,status:status}).success(function(d){
            $scope.qiyeList.list.splice(inx,1);
        });
    }
    $scope.filterDocs=function(){
        if($scope.filter.keyword == '') delete $scope.filter.keyword;
        $http.post(Server + 'keyword/gaoxiaofabuPool/all',{filter:$scope.filter}).success(function(d){
            $scope.gaoxiaoList.list= d.list;
        });
        $http.post(Server + 'keyword/qiyefabuPool/all',{filter:$scope.filter}).success(function(d){
            $scope.qiyeList.list= d.list;
        });
    }
});
//Filters section
var extList=[
    'ai','aiff','ani','asf','au','avi','bat','bin','bmp','bup',
    'cab','cal','cat','cur','dat','dcr','der','dic','dll','doc',
    'docx','dvd','dwg','dwt','fon','gif','hlp','hst','html','ico',
    'ifo','inf','ini','java','jif','jpg','log','m4a','mmf','mmm',
    'mov','mp2','mp2v','mp3','mp4','mpeg','msp','pdf','png','ppt',
    'pptx','psd','ra','rar','reg','rtf','theme','tiff','tlb','ttf',
    'txt','vob','wav','wma','wmv','wpl','wri','xls','xlsx','xml',
    'xsl','zip','ac3'
];
angular.module('etFilters', [])
  .filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
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
}).filter('fileExtIcon', function() {
    return function(filename) {
        var ext = filename.slice(filename.lastIndexOf('.')+1,filename.length).toLowerCase();
        var inx= extList.indexOf(ext);
        if (-1 == inx){
            return  'background-image:url(images/fileDownload.png);background-size: contain';
        }else{
            return  'background:url(images/fileTypes.jpg) -' + ((inx % 10) * 96) +'px -' + (Math.floor(inx / 10)*92) + 'px';
        }
    };
}).filter('docEditable',function(){
    return function(inLists,allLists){
        var r=false;
        for (var j in allLists){
            if ( (inLists.indexOf(allLists[j]._id) > -1) && allLists[j].noEdit) {
                r= true;
            }
        }
        return r;
    };
}).filter('list2Name',function(){
        return function(listId){
            return listMap[listId].name;
    }
})