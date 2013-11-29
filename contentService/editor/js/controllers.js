'use strict';

console.log('Controllers init');
//Controllers section

app.controller('homeCtrl',['$scope','$http',function($scope,$http){

}]);


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
    $scope.doc={
         title:'测试用文档一'
        ,paraList:[
             {html:{raw:'some html text some html text some html <b>text some htm</b>l text some html t<span style="color:blue">ext some html text</span> some html text '}}
            ,{html:{raw:'中文 <b>text some htm</b>l text some html t<span style="color:blue">ext some html text</span> some html text '}}
            ,{image:{url:'http://docs.unity3d.com/Documentation/Images/manual/DirectX11-1.jpg'}}
            ,{image:{url:'http://docs.unity3d.com/Documentation/Images/manual/DirectX11-2.jpg'}}
            ]
        ,inLists:['l1','l2','l6']
    };

    $scope.editPara=function(inx){
        console.log($scope.doc.paraList[inx].html);
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
    $scope.addHtml=function(){
        var p={html:{raw: $sce.trustAsHtml($("#docEditinput").val())}};
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
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $scope.upload = $upload.upload({
                url: 'http://localhost:8881/image/upload', //upload.php script, node.js route, or servlet url
                // method: POST or PUT,
                // headers: {'headerKey': 'headerValue'}, withCredential: true,
                data: {myObj: $scope.myModelObj},
                file: $file
                /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                //fileFormDataName: myFile,
                /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
            //.error(...)
            //.then(success, error, progress);
        }
    };
});

app.controller('imageListCtrl',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
     $scope.imageList={Id:$routeParams.listId, name:'Test List',list:[
        {imgUrl:'http://localhost:8080/webNG/portalWeb/images/1.jpg',caption:'合作签约仪式隆重举行',linkTo:'http://localhost:8080/webNG/portalWeb/news/detail/123445'},
        {imgUrl:'http://localhost:8080/webNG/portalWeb/images/2.jpg',caption:'Demo 2',linkTo:'http://localhost:8080/webNG/portalWeb/news/detail/asdasdf'},
        {imgUrl:'http://localhost:8080/webNG/portalWeb/images/3.jpg',caption:'Example 3',linkTo:'http://localhost:8080/webNG/portalWeb/news/detail/!@!!#!!@!'},
        {imgUrl:'http://localhost:8080/webNG/portalWeb/images/4.jpg',caption:'Test 4',linkTo:'http://localhost:8080/webNG/portalWeb/news/detail/ADADDEDSD'}
     ]};
    $scope.imgInx=0;
    $scope.setInx=function(inx){ $scope.imgInx=inx};
    $scope.removeImg=function(){$scope.imageList.list.splice( $scope.imgInx,1);if (($scope.imageList.list.length-1) <=  $scope.imgInx){$scope.imgInx = $scope.imageList.list.length -1 };};
    $scope.moveImgUp=function(){var tmp=$scope.imageList.list[ $scope.imgInx-1];$scope.imageList.list[ $scope.imgInx-1]=$scope.imageList.list[ $scope.imgInx];$scope.imageList.list[ $scope.imgInx]=tmp;$scope.imgInx--};
    $scope.moveImgDown=function(){var tmp=$scope.imageList.list[ $scope.imgInx+1];$scope.imageList.list[ $scope.imgInx+1]=$scope.imageList.list[ $scope.imgInx];$scope.imageList.list[ $scope.imgInx]=tmp;$scope.imgInx++};

    $scope.imagePool={list:[
        {url:'http://localhost:8080/webNG/portalWeb/images/1.jpg'},
        {url:'http://localhost:8080/webNG/portalWeb/images/2.jpg'},
        {url:'http://localhost:8080/webNG/portalWeb/images/3.jpg'},
        {url:'http://localhost:8080/webNG/portalWeb/images/4.jpg'}
    ]};
    $scope.addImage=function(url){
        $scope.showImagePicker=false;
        $scope.imageList.list.unshift({imgUrl:url,caption:'',linkTo:'',timeSpan:3});
        $scope.imgInx =  0;
        document.getElementById("img_caption").focus();
    };
}]);
//Filters section
angular.module('etFilters', []).filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});
