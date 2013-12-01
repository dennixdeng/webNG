'use strict';

console.log('Controllers init');
//Controllers section

app.controller('homeCtrl',['$scope','$http',function($scope,$http){

}]);

var Server="http://localhost:8881/";

app.controller('docCtrl',function($scope,$http,$routeParams,$sce,$upload){
    $scope.allLists=[{id:'l1',name:'列表1'},{id:'l2',name:'列表2'},{id:'l3',name:'列表3'},{id:'l4',name:'列表4'},{id:'l5',name:'列表5'},{id:'l6',name:'列表6'},{id:'l7',name:'列表7'}];
    $scope.toggleList=function(l){
        var inx = $scope.doc.inLists.indexOf(l);
       if ( -1 == inx ){
           $scope.doc.inLists.push(l);
        }else{
            $scope.doc.inLists.splice(inx,1);
        }
    };
    $http({method: 'GET', url: Server + 'get_list/imagePool'}).
        success(function(data, status, headers, config) {
            console.log(data);
            $scope.imagePoolData = data;
        }).error(function(data, status, headers, config) {
            console.log(status);
        });
    var docId= $routeParams.docId;
    if ('new' == docId) {
        $scope.doc={
            _id: null,
            title:''
            ,paraList:[]
            ,inLists:[]
        };
    }else{
        $http.get(Server + 'open/docPool/' + docId).success(function(data){
            $scope.doc=data;
        })
    };

    $scope.saveDoc=function(){
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
        var p={html:{raw: $sce.trustAsHtml($("#docEditinput").val())}};
        $scope.writePara(p);
    };
    $scope.addImage=function(imgInx){
        var p={image:{url:$scope.imagePoolData[imgInx].url}};
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
                    url: 'http://localhost:8881/image/upload',
                    // headers: {'headerKey': 'headerValue'}, withCredential: true,
                    data: {myObj: $scope.myModelObj},
                    file: $file
                }).progress(function(evt) {
                    $scope.uploadPercet =   parseInt(100.0 * evt.loaded / evt.total);
                    console.log(evt.loaded);
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
            console.log(data);
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
                    // url: 'http://115.29.179.40:8881/image/upload',
                    url: 'http://localhost:8881/image/upload',
                    // headers: {'headerKey': 'headerValue'}, withCredential: true,
                    data: {myObj: $scope.myModelObj},
                    file: $file
                }).progress(function(evt) {
                        $scope.uploadPercet =   parseInt(100.0 * evt.loaded / evt.total);
                        console.log(evt.loaded);
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

app.controller('docListCtrl',function($scope,$http,$routeParams){

});
//Filters section
angular.module('etFilters', []).filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});
