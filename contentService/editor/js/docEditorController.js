'use strict';

var app=angular.module('app',['ngRoute','ngSanitize','etFilters','angularFileUpload'])
    .config(['$locationProvider',function($locationProvider){
        $locationProvider.html5Mode(true);
    }]);

var Server="http://t.easytag.cn/";
//var Server="http://localhost:8881/";
var currentUser;
app.controller('docCtrl',function($scope,$http,$location,$sce,$upload,$filter){
    if (localStorage.getItem('userInfo')){
        currentUser = JSON.parse(localStorage.getItem('userInfo'));
        $scope.userName=currentUser.name;
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
    $scope.catShow=[true,true,false,true,true,true];
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
            $scope.imagePoolData = $filter('orderBy')(data,'_id',true);
        }).error(function(data, status, headers, config) {
            console.log(status);
        });

    var docId= ($location.search()).docId;
    var defaultDate=new Date();
    $scope.doc={
        _id:docId
        ,title:''
        ,year: defaultDate.getFullYear()
        ,month: defaultDate.getMonth()+1
        ,day: defaultDate.getDate()
        ,paraList:[]
        ,inLists:(($location.search()).listId?[($location.search()).listId]:[])
        ,isListIntro:($location.search()).isListIntro
        ,createBy: currentUser?{uid:currentUser.uid,name:currentUser.name}:'errorGetUser'
        ,editHistory:[]
    };
    if (docId !='newdoc') $http.get(Server + 'open/docPool/' + docId)
    .success(function(data){
        $scope.doc=data;
        if (null ==$scope.doc.displayDate){
            $scope.doc.displayDate=new Date();
        }else{
            $scope.doc.displayDate=new Date($scope.doc.displayDate);
        }
        $scope.doc.year=$scope.doc.displayDate.getFullYear();
        $scope.doc.month=$scope.doc.displayDate.getMonth()+1;
        $scope.doc.day=$scope.doc.displayDate.getDate();
        for (var i in $scope.doc.paraList) {
            var p = $scope.doc.paraList[i];
            if (p.html && ('string' == typeof(p.html.raw) ) ) { p.html.show=$sce.trustAsHtml(p.html.raw);}
        };
    });
    $scope.setDocStatus=function(status){
        $http.post(Server + 'setStatus/docPool',{_id:$scope.doc._id,status:status}).success(function(){

        });
    };
    $scope.saveDoc=function(){
        $scope.doc.displayDate = new Date();
        $scope.doc.displayDate.setFullYear($scope.doc.year,$scope.doc.month-1, $scope.doc.day);
        if ($scope.doc.title == '') {$scope.title_error = '请输入标题文字'; return};
        $scope.doc.editHistory = $scope.doc.editHistory||[];
        $scope.doc.editHistory.push({timeStamp:new Date(),user:currentUser?{uid:currentUser.uid,name:currentUser.name}:'errorGetUser' });
        $scope.doc.searchText='';
        for (var i in $scope.doc.paraList){
            if ($scope.doc.paraList[i].html) $scope.doc.searchText += $scope.doc.paraList[i].html.raw.replace(/<[^>]*>/g, "");
            if ($scope.doc.paraList[i].attachment) {
                $scope.doc.searchText += $scope.doc.paraList[i].attachment.name;
                $scope.doc.searchText += $scope.doc.paraList[i].attachment.displayName;
            }
        }
        $http.post( Server + 'save/docPool', {doc:$scope.doc}).
            success(function(data, status, headers, config) {
                $scope.serverMessage='保存成功';
            }).error(function(data, status, headers, config) {
                console.log(status);
            });

    }
    $scope.editPara=function(inx){
        if ($scope.doc.paraList[inx].html){
            editor.html($scope.doc.paraList[inx].html.raw);
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
        editor.html('');
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
        if (!$scope.attachmentPoolData){
            $http.get( Server + 'get_list/attachmentPool').
            success(function(data, status, headers, config) {
                $scope.attachmentPoolData = $filter('orderBy')(data,'_id',true);;
            }).error(function(data, status, headers, config) {
                console.log(status);
            });
        };
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
        var p={html:{raw: editor.html(),show:$sce.trustAsHtml(editor.html())}};
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
                    $scope.imagePoolData.unshift(data);
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
                    $scope.attachmentPoolData.unshift(data);
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
    $scope.filterAttachment=function(name){
        $http.post( Server + 'filter_pool/attachmentPool/all',{filter:{name:name}}).
            success(function(data, status, headers, config) {
                $scope.attachmentPoolData = $filter('orderBy')(data.list,'_id',true);
            }).error(function(data, status, headers, config) {
                console.log(status);
            });
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
                        $scope.imagePoolData.unshift(data);
                    });
            }
            //.error(...)
            //.then(success, error, progress);
        }
    };
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
    });
var listMap={};
var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="docEditinput"]', {
        resizeType : 1,
        allowPreviewEmoticons : false,
        allowImageUpload : true,
        allowFileManager : true
    });
});