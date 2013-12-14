'use strict';

var autoRefresh; //The global auto refresh timer. make sure clear it before new one created.
//Controllers section

app.controller('homeCtrl',['$scope','$http',function($scope,$http){

}]);

//var Server="http://t.easytag.cn/";
var Server="http://localhost:8881/";

app.controller('docCtrl',function($scope,$http,$routeParams,$sce,$upload){

    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ; //[{id:'l1',name:'列表1'},{id:'l2',name:'列表2'},{id:'l3',name:'列表3'},{id:'l4',name:'列表4'},{id:'l5',name:'列表5'},{id:'l6',name:'列表6'},{id:'l7',name:'列表7'}];
    });
    $scope.toggleList=function(l){
        var inx = $scope.doc.inLists.indexOf(l);
       if ( -1 == inx ){
           $scope.doc.inLists.push(l);
        }else{
            $scope.doc.inLists.splice(inx,1);
        }
    };
    $http.get( Server + 'get_list/imagePool').
        success(function(data, status, headers, config) {
            $scope.imagePoolData = data;
        }).error(function(data, status, headers, config) {
            console.log(status);
        });
    $http.get( Server + 'get_list/attachmentPool').
        success(function(data, status, headers, config) {
            $scope.attachmentPoolData = data;
        }).error(function(data, status, headers, config) {
            console.log(status);
        });

    var docId= $routeParams.docId;
    if (undefined == docId) {
        $scope.doc={
             title:''
            ,displayDate: (new Date()).toLocaleDateString()
            ,paraList:[]
            ,inLists:($routeParams.listId)?[$routeParams.listId]:[]
        };
    }else{
        $http.get(Server + 'open/docPool/' + docId)
        .success(function(data){
            $scope.doc=data;
            for (var i in $scope.doc.paraList) {
                var p = $scope.doc.paraList[i];
                if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
            }
        })
    };

    $scope.saveDoc=function(){
        console.log($scope.doc);
        if ($scope.doc.title == '') {$scope.title_error = '请输入标题文字'; return};
        $http.post( Server + 'save/docPool', {doc:$scope.doc}).
            success(function(data, status, headers, config) {
                $scope.serverMessage='保存成功';
            }).error(function(data, status, headers, config) {
                console.log(status);
            });
    }
    $scope.editPara=function(inx){
        if ($scope.doc.paraList[inx].html){

            if (0 == $('.cleditorMain').length) { $("#docEditinput").cleditor({height:600,width:796}); };
            $("#docEditinput").val($scope.doc.paraList[inx].html.raw).blur();
            $scope.editing=1;
        };
        if ($scope.doc.paraList[inx].image){
            $scope.editing=2;
        };
        if ($scope.doc.paraList[inx].attachment){
            $scope.editing=3;
        };
        $scope.paraInx=inx;
        $scope.replace=true;
    };
    $scope.newHtml=function(inx){
        if (0 == $('.cleditorMain').length) { $("#docEditinput").cleditor({height:600,width:796}); };
        $scope.editing=1;
        $scope.paraInx=inx;
        $scope.replace=false;
    };
    $scope.newImage=function(inx){
        $scope.editing=2;
        $scope.paraInx=inx;
        $scope.replace=false;
    };
    $scope.newAttachment=function(inx){
        $scope.editing=3;
        $scope.paraInx=inx;
        $scope.replace=false;
    };
    $scope.removePara=function(inx){$scope.doc.paraList.splice(inx,1);};
    $scope.writePara=function(p){
        if (-1 == $scope.paraInx){
            $scope.doc.paraList.push(p);
        }else{
            if( $scope.replace){
                $scope.doc.paraList[$scope.paraInx]=p;
            }else{
                $scope.doc.paraList.splice($scope.paraInx,0,p);
            }
        }
    };
    $scope.addHtml=function(){
        var p={html:{raw: $("#docEditinput").val(),show:$sce.trustAsHtml($("#docEditinput").val())}};
        $scope.writePara(p);
    };
    $scope.addImage=function(imgInx){
        var p={image:{url:$scope.imagePoolData[imgInx].url}};
        $scope.writePara(p);
        $scope.editing=0;
    };
    $scope.addAttachment=function(attachmentInx){
        var p={attachment:$scope.attachmentPoolData[attachmentInx]};
        $scope.writePara(p);
        $scope.editing=0;
    };

    $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ( -1 == $file.type.indexOf('image') ){
                $scope.messageFile = '需要PNG, JPG 或 GIF文件';
            }else{
                $scope.upload = $upload.upload({
                    // url: 'http://115.29.179.40:8881/image/upload',
                    url: Server + 'image/upload',
                    // headers: {'headerKey': 'headerValue'}, withCredential: true,
                    data: {myObj: $scope.myModelObj},
                    file: $file
                }).progress(function(evt) {
                    $scope.uploadPercet =   parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.messageFile = '上传成功';
                    $scope.imagePoolData.push(data);
                });
            }
            //.error(...)
            //.then(success, error, progress);
        }
    };
    $scope.deleteImage=function(inx){
        $http.get(Server + 'remove/imagePool/' + $scope.imagePoolData[inx]._id)
            .success(function(){
                $scope.imagePoolData.splice(inx,1);
            })
    }
    $scope.onAttachmentSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            var newFileName = window.prompt("需要为附件提供下载名称吗？",$file.name) || $file.name;
            $scope.upload = $upload.upload({
                url: Server + 'attachment/upload',
                // headers: {'headerKey': 'headerValue'}, withCredential: true,
                data: {displayName: newFileName},
                file: $file
            }).progress(function(evt) {
                    $scope.attUploadPercet =   parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.messageFile = '上传成功';
                    $scope.attachmentPoolData.push(data);
                });
            //.error(...)
            //.then(success, error, progress);
        }
    };
    $scope.deleteAttachment=function(inx){
        $http.get(Server + 'remove/attachmentPool/' + $scope.attachmentPoolData[inx]._id)
            .success(function(){
                $scope.attachmentPoolData.splice(inx,1);
            })
    }
});

app.controller('imageListCtrl',function($scope,$http,$routeParams,$upload){
     $http.get(Server + 'open/imageListPool/' + $routeParams.listId).success(function(data){
        $scope.imageList=data;
     })

    $scope.save=function(){
        $http.post(Server + 'save/imageListPool',{doc:$scope.imageList})
        .success(function(){ $scope.serverMessage='保存成功';;});
    };

    $scope.imgInx=0;
    $scope.setInx=function(inx){ $scope.imgInx=inx};
    $scope.removeImg=function(){$scope.imageList.list.splice( $scope.imgInx,1);if (($scope.imageList.list.length-1) <=  $scope.imgInx){$scope.imgInx = $scope.imageList.list.length -1 };};
    $scope.moveImgUp=function(){var tmp=$scope.imageList.list[ $scope.imgInx-1];$scope.imageList.list[ $scope.imgInx-1]=$scope.imageList.list[ $scope.imgInx];$scope.imageList.list[ $scope.imgInx]=tmp;$scope.imgInx--};
    $scope.moveImgDown=function(){var tmp=$scope.imageList.list[ $scope.imgInx+1];$scope.imageList.list[ $scope.imgInx+1]=$scope.imageList.list[ $scope.imgInx];$scope.imageList.list[ $scope.imgInx]=tmp;$scope.imgInx++};

    $scope.addImage=function(imgInx){
        $scope.editing=0;
        $scope.imageList.list.unshift({imgUrl:$scope.imagePoolData[imgInx].url,caption:'',linkTo:'',timeSpan:3});
        $scope.imgInx =  0;
        document.getElementById("img_caption").focus();
    };
    $http({method: 'GET', url: Server + 'get_list/imagePool'}).
        success(function(data, status, headers, config) {
            $scope.imagePoolData = data;
        }).error(function(data, status, headers, config) {
            console.log(status);
        });

    $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ( -1 == $file.type.indexOf('image') ){
                $scope.messageFile = '需要PNG, JPG 或 GIF文件';
            }else{
                $scope.upload = $upload.upload({
                    url: Server + 'image/upload',
                    // headers: {'headerKey': 'headerValue'}, withCredential: true,
                    data: {myObj: $scope.myModelObj},
                    file: $file
                }).progress(function(evt) {
                        $scope.uploadPercet =   parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        $scope.messageFile = '上传成功';
                        $scope.imagePoolData.push(data);
                    });
            }
            //.error(...)
            //.then(success, error, progress);
        }
    };
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


app.controller('fabuListCtrl',function($scope,$http,$routeParams,$window){
    $scope.docList={fromList:{name:'ttt'}};
    var loadList=function(listId){
        if ('noListDocs' == listId){
            $http.get(Server + 'list_title/qiyefabuPool/all/none').success(function(d){
                $scope.docList.list= d.list ;
                $scope.docList.fromList= {name:'草稿箱'} ;
            });
        }else{
            $http.get(Server + 'list_title/qiyefabuPool/all/' + listId).success(function(d){
                $scope.docList.list= d.list ;
                $scope.docList.fromList= d.fromList ;
            });
        }
    }
    loadList($routeParams.docListId);
    clearInterval($scope.autoRefresh);
    $scope.autoRefresh = setInterval(loadList,5000,$routeParams.docListId);

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
     $scope.login=function(){
         $http.get(Server + 'user/login/' + $scope.uid + '/' + $scope.pwd).success(function(d){
              currentUser = d;
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
    }
    $scope.user={name:'测试用户'};
    $scope.logOut=function(){
        $scope.user = currentUser = {};
        showLoginScreen();
    }
});

app.controller('naviPanelCtrl',function($scope,$http,$routeParams,$location){
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ;
    });
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
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists =  d;
    });
    $scope.show='';
    $scope.newUserForm=function(){
        $scope.newUser={acl:{}};
        $scope.show='newUserForm';
    }
    $scope.createUser=function(){
        console.log($scope.newUser);
        $http.post(Server + 'user/new/',$scope.newUser).success(function(d){
            $scope.show='';
            loadUsers();
        });
    };
    $scope.userIndex=function(inx){
        $scope.userInx=inx;
    }
});
app.controller('docCategoryMgmCtrl',function($scope,$http,$routeParams,$location){
    $http.get(Server + 'get_list/listPool').success(function(d){
        $scope.allLists=d ;
    });
    $scope.newClasses=[];
    $scope.creatClass=function(){
        $scope.newClasses.push({name:''});
    }
    $scope.addClass=function(inx){
        $scope.allLists.push($scope.newClasses[inx]);
        $scope.newClasses.splice(inx,1);
    }
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
})