var PORT_Content_Service=8881;
var uuid=require('uuid');

var Db = require('mongodb').Db
    , Connection = require('mongodb').Connection
    , Server = require('mongodb').Server
    ,BSON = require('mongodb').BSONPure
    , format = require('util').format
    ,ObjectID = require('mongodb').ObjectID;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var mdb={};
function getDBCollection(db_alias,cList){
    Db.connect(format("mongodb://%s:%s/%s", host, port,db_alias), function(err, db) {
        console.log('MongoDB connected, host '+host);
        for (var i in cList){
            db.collection(cList[i], function(err, collection) {
                mdb[cList[i]] = collection;
            });
        }
    });
};

getDBCollection('webNG_SUEU',['imagePool','attachmentPool','listPool','imageListPool','docPool','qiyefabuPool','gaoxiaofabuPool']);

var ossAPI = require('oss-client');
//var ossHost='oss.aliyuncs.com';
var ossHost='oss-internal.aliyuncs.com';

var oss = new ossAPI.OssClient({host:ossHost,accessKeyId: 'Ybx6lzed1szPRAuI',accessKeySecret: 'yoih8NiSadOlPJ9Syi65w7LdRsc6zA'});

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

app.get('/list/:pool/:top/:listId',function(req,res){
    var qObj={};
    var sortObj= {sort:[['_id','desc']]};
    switch (req.params.listId){
        case 'all':qObj = {};
            break;
        case 'none':qObj = {inLists:{$size: 0}};
            break;
        default : qObj = {inLists:{$in:[req.params.listId]}};
            break;
    }
    if ('all' != req.params.top){
        sortObj.limit =  req.params.top;
    }
    mdb[req.params.pool].find(qObj,{},sortObj).toArray(function(e,d){
        res.send(d);
    });
});
app.get('/list_title/:pool/:top/:listId',function(req,res){
    var qObj={};
    var sortObj= {sort:[['_id','desc']]};
    switch (req.params.listId){
        case 'all':qObj = {};
            break;
        case 'none':qObj = {inLists:{$size: 0}};
            break;
        default : qObj = {inLists:{$in:[req.params.listId]}};
            break;
    }
    if ('all' != req.params.top){
        sortObj.limit =  req.params.top;
    }
    mdb[req.params.pool].find(qObj,{title:1},sortObj).toArray(function(e,d){
        res.send(d);
    });
});
app.get('/get_list/:pool',function(req,res){
    mdb[req.params.pool].find().toArray(function(e,d){
        res.send(d);
    });
});

app.post('/image/upload',express.bodyParser(),function(req,res){
    if (req.files){
        var uid =   uuid.v4();
        oss.putObject({bucket: 'webngimage',object: uid,srcFile: req.files.file.path},
          function (error, result) {
            if (error){
                res.status(400).send(error);
            }else{
                var fileInfo= {
                    fileId : uid,
                    url: 'http://webngimage.oss-cn-hangzhou.aliyuncs.com/'+uid,
                    name:req.files.file.originalFilename,
                    type:req.files.file.type,
                    size: req.files.file.size
                };
                mdb['imagePool'].insert(fileInfo, function(){ res.send(fileInfo); });
            };
        })
    }
});
app.post('/attachment/upload',express.bodyParser(),function(req,res){
    if (req.files){
        var uid =   uuid.v4();
        oss.putObject({bucket: 'webngattachment',
                 object: uid,
                srcFile: req.files.file.path,
                "Content-Disposition":'attachment;filename="' + req.files.file.originalFilename + '"'},
            function (error, result) {
                if (error){
                    res.status(400).send(error);
                }else{
                    var fileInfo= {
                        fileId : uid,
                        url: 'http://webngattachment.oss-cn-hangzhou.aliyuncs.com/'+uid,
                        name:req.files.file.originalFilename,
                        type:req.files.file.type,
                        size: req.files.file.size
                    };
                    mdb['attachmentPool'].insert(fileInfo, function(){ res.send(fileInfo); });
                };
            })
    }
});
app.get('/open/:pool/:_id',function(req,res){
    var docid =  ObjectID(req.params._id);
    mdb[req.params.pool].find({_id:docid}).nextObject(function(e,d){
        if (d){
            res.send(d);
        }else{
            res.status(404).send({detail:'ID not found'});
        }
    });
});

app.post('/save/:pool',express.bodyParser(),function(req,res){
    var docid =  ObjectID(req.body.doc._id);
    delete req.body.doc._id ;
    mdb[req.params.pool].update({_id:docid},req.body.doc,{upsert:true},function(e,d){
        res.send({_id: d._id});
    });

});