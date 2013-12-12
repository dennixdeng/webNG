'use strict';
//component section
var Component={
    http:null,
    scope:null,
    newimageList :function(Id){
        var obj ={_id:Id};
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
    newTextSlider :function(pool,top,list){
        var obj ={_id:list};
        Component.http.get(Server +'list_title/'+pool+'/'+top+'/'+list).success(function(d){
            obj.list= d.list;
            obj.current = 0;
            obj.next=function(){
                obj.current++;
                if (obj.current >= obj.list.length) obj.current= 0;
                Component.scope.$apply();
            }
            var i=setInterval(obj.next,2000);
        });
        return obj;
    },
    newList:function(top,Id){
        var obj={_id:Id};
        Component.http.get(Server +'list/docPool/'+top + '/' + Id).success(function(d){
            obj.list= d.list;
            obj.fromList = d.fromList;
        });
        return obj;
    },
    newTitleList:function(pool,top,list){
        var obj={_id:list};
        Component.http.get(Server +'list_title/'+pool+'/'+top+'/'+list).success(function(d){
            obj.list= d.list;
            obj.fromList= d.fromList;
            console.log(d.fromList);
        });
        return obj;
    }
}
//Filters section
angular.module('etFilters', [])
    .filter('checkmark', function() {
        return function(input) {
            return input ? '\u2713' : ''; //'\u2718';
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
            return brief.substr(0,len)+'...';
        };
    }).filter('docAttachment', function() {
        return function(doc,inx) {
            if (!doc) return null;
            var dlInx=inx||0;
            for (var i in doc.paraList){
                if( doc.paraList[i].attachment ) {
                    if ( 0 == dlInx){
                        return doc.paraList[i].attachment.url;
                    }else{
                        dlInx--;
                    }
                }
            }
            return null;
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
    }).filter('Id2Date',function(){
        return function(id){
            return new Date(parseInt(id.toString().slice(0,8), 16)*1000).Format("yyyy-MM-dd");
        }
    }).filter('cnDate',function(){
        return function(date){

        }
    }).filter('docEditable',function(){
        return function(inLists,allLists){
            var r=false;
            for (var j in allLists){
                if ( (inLists.indexOf(allLists[j]._id) > -1) && allLists[j].noEdit) {
                    r= true;
                }
            }
            return r;
        }
    }).filter('list2Name',function(){
        return function(listId){
            return listMap[listId].name;
        }
    }).filter('removeDocClass',function(){
        return function(inLists){
            var r = [];
            for (var i in inLists) if (listMap[inLists[i]].parent != '类别' ) r.push(inLists[i]);
            return r;
        }
    });


 //Tools
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
