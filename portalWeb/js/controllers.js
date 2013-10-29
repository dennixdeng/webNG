'use strict';

console.log('Controllers init');
//Controllers section
app.controller('menuContoller',['$scope',function($scope){
    $scope.menuItems=[
        {caption:'网站首页', left:29, linkTo:'/home',
            subMenu:[
            ]},
        {caption:'市场概况', left:80,  linkTo:'',
            subMenu:[
                {caption:'简介',linkTo:'/intro/brief'},
                {caption:'机构设置',linkTo:'/intro/orgnization'},
                {caption:'工作人员',linkTo:'/intro/staff'}
            ]},
        {caption:'新闻动态', left:152,  linkTo:'',
            subMenu:[
            ]},
        {caption:'高校会展', left:322,  linkTo:'',subMenu:[
            {caption:'热点信息',linkTo:''},
            {caption:'工博会',linkTo:''},
            {caption:'其他展览',linkTo:''}
        ]},
        {caption:'成果转化', left:404,  linkTo:'',subMenu:[
            {caption:'企业需求发布',linkTo:''},
            {caption:'高校成果发布',linkTo:''},
            {caption:'经纪人评估',linkTo:''},
            {caption:'案例展示',linkTo:''}
        ]},
        {caption:'合同登记', left:407,  linkTo:'',subMenu:[

        ]},
        {caption:'技术转移', left:666,  linkTo:'', subMenu:[

        ]},
        {caption:'政策法规', left:577,  linkTo:'', subMenu:[

        ]},
        {caption:'相关下载', left:577,  linkTo:'', subMenu:[

        ]}
    ];

    $scope.menuShow=function(inx){
        $scope.activeMenu=inx;
    }
}]);
app.controller('homepageCtrl',['$scope',function($scope){
    $scope.home_slide_0={current:0,list:[
        {imgUrl:'images/1.jpg',caption:'上海高校技术市场、上海知识产权园迁址合作签约仪式隆重举行',linkTo:'/news/detail/123445'},
        {imgUrl:'images/2.jpg',caption:'Demo 2',linkTo:'/news/detail/asdasdf'},
        {imgUrl:'images/3.jpg',caption:'Example 3',linkTo:'/news/detail/!@!!#!!@!'},
        {imgUrl:'images/4.jpg',caption:'Test 4',linkTo:'/news/detail/ADADDEDSD'}
    ]};
    $scope.home_slide_0.next=function(){
        $scope.home_slide_0.current++;
        if ($scope.home_slide_0.current == $scope.home_slide_0.list.length) $scope.home_slide_0.current= 0;
        $scope.$apply();
    }
    setInterval($scope.home_slide_0.next,3000);
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
