var PORT_Content_Service=8881;
var uuid=require('uuid');
var mv = require('mv');
var ossAPI = require('oss-client');
var oss = new ossAPI.OssClient({accessKeyId: 'Ybx6lzed1szPRAuI',accessKeySecret: 'yoih8NiSadOlPJ9Syi65w7LdRsc6zA'});
var ossBucket= 'webngimage';
oss.listObject({bucket: ossBucket},
    function (error, result) {
        if (error){ console.log (error); return };
        var r= result.ListBucketResult.Contents;
        for (var i in r){
            console.log (r[i].Key);
        };
})


var express = require('express');
var app = express();

var CROS_OK=function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Method","POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers","Content-Type,X-Requested-With");
    res.header('Access-Control-Max-Age','1000');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
}
app.configure(function(){app.use(CROS_OK);});
app.options("*",function(req,res){res.end('Good day');});
app.listen(PORT_Content_Service);
console.log('Content Service listening on ' + PORT_Content_Service);

app.get('/get_list_by_tag/:tag',function(req,res){
   var imgList=  [
       {imgUrl:'IMG_3086.JPG',link:'news/aaaa'}
       ,{imgUrl:'IMG_3369.JPG',link:'news/bbbb'}
       ,{imgUrl:'IMG_3400.JPG',link:'news/cccc'}
       ,{imgUrl:'IMG_3419.JPG',link:'news/dddd'}
       ,{imgUrl:'IMG_3486.JPG',link:'news/eeee'}
       ,{imgUrl:'IMG_3487.JPG',link:'news/ffff'}
   ];
   for (i in imgList) imgList[i].imgUrl = 'http://localhost:8080/webNG/contentService/static/images/'+imgList[i].imgUrl;
   res.send({ok:imgList});
});

app.post('/image/upload',express.bodyParser(),function(req,res){
    if (req.files){
        console.log(req.files);
        oss.putObject({bucket: ossBucket,object: uuid.v4(),srcFile: req.files.file.path},
          function (error, result) {
            console.log(error);
        })
    }
});