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
    newTextSlider :function(pool,top,list,homePage,stickyTop){
        var obj ={_id:list};
        var opStr='?' +( homePage?'&homePage=1':'' )+(stickyTop?'&stickyTop=1':'');
        Component.http.get(Server +'list_title/'+pool+'/'+top+'/'+list + opStr).success(function(d){
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
    newList:function(top,Id,homePage,stickyTop){
        var obj={_id:Id};
        var opStr='?' + (homePage?'&homePage=1':'') +(stickyTop?'&stickyTop=1':'');
        Component.http.get(Server +'list/docPool/'+top + '/' + Id + opStr).success(function(d){
            obj.list= d.list;
            obj.fromList = d.fromList;
        });
        return obj;
    },
    newTitleList:function(pool,top,list,homePage,stickyTop){
        var obj={_id:list};
        var opStr='?' +( homePage?'&homePage=1':'') +(stickyTop?'&stickyTop=1':'');
        Component.http.get(Server +'list_title/'+pool+'/'+top+'/'+list +opStr ).success(function(d){
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

var PDFObject=function(h){if(!h||!h.url){return false}var e="1.2",c=h.id||false,d=h.width||"100%",p=h.height||"100%",g=h.pdfOpenParams,a,m,l,b,j,i,n,o,q,f,k;l=function(r){var s;try{s=new ActiveXObject(r)}catch(t){s=null}return s};b=function(){var r=null;if(window.ActiveXObject){r=l("AcroPDF.PDF");if(!r){r=l("PDF.PdfCtrl")}if(r!==null){return true}}return false};j=function(){var r,u=navigator.plugins,s=u.length,t=/Adobe Reader|Adobe PDF|Acrobat/gi;for(r=0;r<s;r++){if(t.test(u[r].name)){return true}}return false};i=function(){var r=navigator.mimeTypes["application/pdf"];return(r&&r.enabledPlugin)};n=function(){var r=null;if(j()||b()){r="Adobe"}else{if(i()){r="generic"}}return r};o=function(){var s=document.getElementsByTagName("html"),t,r;if(!s){return false}t=s[0].style;r=document.body.style;t.height="100%";t.overflow="hidden";r.margin="0";r.padding="0";r.height="100%";r.overflow="hidden"};q=function(s){var r="",t;if(!s){return r}for(t in s){if(s.hasOwnProperty(t)){r+=t+"=";if(t==="search"){r+=encodeURI(s[t])}else{r+=s[t]}r+="&"}}return r.slice(0,r.length-1)};f=function(s){var r=null;switch(s){case"url":r=a;break;case"id":r=c;break;case"width":r=d;break;case"height":r=p;break;case"pdfOpenParams":r=g;break;case"pluginTypeFound":r=m;break;case"pdfobjectversion":r=e;break}return r};k=function(r){if(!m){return false}var s=null;if(r){s=(r.nodeType&&r.nodeType===1)?r:document.getElementById(r);if(!s){return false}}else{s=document.body;o();d="100%";p="100%"}s.innerHTML='<object    data="'+a+'" type="application/pdf" width="'+d+'" height="'+p+'"></object>';return s.getElementsByTagName("object")[0]};a=encodeURI(h.url)+"#"+q(g);m=n();this.get=function(r){return f(r)};this.embed=function(r){return k(r)};this.pdfobjectversion=e;return this};

