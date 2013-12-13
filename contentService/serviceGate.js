var PORT_Content_Service=8881;
var uuid=require('uuid');

var Db = require('mongodb').Db
    , Connection = require('mongodb').Connection
    , Server = require('mongodb').Server
    ,BSON = require('mongodb').BSONPure
    , format = require('util').format
    ,OriginalObjectID = require('mongodb').ObjectID;

var ObjectID =function(str){
    try{
        var oid = OriginalObjectID(str);
        return oid;
     }catch (e){
        console.log(e);
        return null;
    }
}
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

getDBCollection('webNG_SUEU',['WebNG_users','imagePool','attachmentPool','listPool',
                                'imageListPool','docPool','qiyefabuPool','gaoxiaofabuPool',
                                'fabustatusPool','publicUserPool']);

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
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires",0);
    next();
}
app.configure(function(){app.use(CROS_OK);});
app.options("*",function(req,res){res.end('Good day');});
app.listen(PORT_Content_Service);
console.log('Content Service listening on ' + PORT_Content_Service);

app.get('/list/:pool/:top/:listId',function(req,res){
    var qObj={};
    var sortObj= {sort:[['_id','desc']]};
    var getName=false;
    switch (req.params.listId){
        case 'all':qObj = {};
            break;
        case 'none':qObj = {inLists:{$size: 0}};
            break;
        default : qObj = {inLists:{$in:[req.params.listId]}};
            getName=true;
            break;
    }
    if ('all' != req.params.top){
        sortObj.limit =  req.params.top;
    }
    mdb[req.params.pool].find(qObj,{},sortObj).toArray(function(e,d){
        var r={list:d}
        if (getName){
            mdb['listPool'].find({_id:ObjectID(req.params.listId)}).nextObject(function(e,dlist){
                if (dlist) r.fromList = dlist;
                res.send(r);
            })
        }else{
            res.send(r);
        }
    });
});
app.get('/list_title/:pool/:top/:listId',function(req,res){
    var qObj={};
    var sortObj= {sort:[['_id','desc']]};
    var getName=false;
    switch (req.params.listId){
        case 'all':qObj = {};
            break;
        case 'none':qObj = {inLists:{$size: 0}};
            break;
        default : qObj = {inLists:{$in:[req.params.listId]}};
            getName=true;
            break;
    }
    if ('all' != req.params.top){
        sortObj.limit =  req.params.top;
    }
    mdb[req.params.pool].find(qObj,{title:1,redirect:1,displayDate:1,inLists:1},sortObj).toArray(function(e,d){
        var r={list:d};
        if (getName){
            mdb['listPool'].find({_id:ObjectID(req.params.listId)}).nextObject(function(e,dlist){
                if (dlist) r.fromList = dlist;
                res.send(r);
            })
        }else{
            res.send(r);
        }
    });
});
app.get('/get_list/:pool',function(req,res){
    mdb[req.params.pool].find().sort({_id:1}).toArray(function(e,d){
        res.send(d);
    });
});

app.get('/image_list',function(req,res){
    mdb['imagePool'].find().toArray(function(e,d){
         for (var i in d){
             d[i].is_dir=false;d[i].had_file=false;
             d[i].filesize = d[i].size;
             d[i].is_photo = true;
             d[i].filetype=d[i].type;
             d[i].filename=d[i].fileId;
             d[i].datetime=new Date(parseInt(d[i]._id.toString().slice(0,8), 16)*1000);
         }
        var r={
            "moveup_dir_path":"",
            "current_dir_path":"",
            "current_url":"http://webngimage.oss-cn-hangzhou.aliyuncs.com/",
            "total_count":5,
            "file_list":d
        };
        res.send(r);
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


app.post('/image/simpleUpload',express.bodyParser(),function(req,res){

    if (req.files){
        var f = req.files.imgFile;
        console.log(f) ;
        var uid =   uuid.v4();
        oss.putObject({bucket: 'webngimage',object: uid,srcFile: f.path},
            function (error, result) {
                if (error){
                    res.status(400).send(error);
                }else{
                    var fileInfo= {
                        fileId : uid,
                        url: 'http://webngimage.oss-cn-hangzhou.aliyuncs.com/'+uid,
                        name:f.originalFilename,
                        type:f.type,
                        size: f.size
                    };
                    mdb['imagePool'].insert(fileInfo, function(){ res.send(fileInfo); });
                };
            });
    }
});


app.post('/attachment/upload',express.bodyParser(),function(req,res){
    if (req.files){
        var uid =   uuid.v4();
        var displayName =  req.body.displayName || req.files.file.originalFilename;
        oss.putObject({bucket: 'webngattachment',
                 object: uid,
                srcFile: req.files.file.path,
                "Content-Disposition":'attachment;filename="' + encodeURIComponent(displayName) + '"'},
            function (error, result) {
                if (error){
                    res.status(400).send(error);
                }else{
                    var fileInfo= {
                        fileId : uid,
                        url: 'http://webngattachment.oss-cn-hangzhou.aliyuncs.com/'+uid,
                        name:req.files.file.originalFilename,
                        showName: displayName,
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
            mdb[req.params.pool].update({_id:docid},{$inc:{readCount:1}},function(e){});
            res.send(d);
        }else{
            res.status(404).send({detail:'ID not found'});
        }
    });
});
app.get('/remove/:pool/:_id',function(req,res){
    var docid =  ObjectID(req.params._id);
    mdb[req.params.pool].remove({_id:docid},function(err, numberOfRemovedDocs){
        if (err) {res.status(401).send({detail:err});}
        if (0 == numberOfRemovedDocs){res.status(404).send({detail:'ID not found'});}
        res.send({_id:docid});
    });
});

app.post('/save/:pool',express.bodyParser(),function(req,res){
    var docid =  ObjectID(req.body.doc._id);
    delete req.body.doc._id ;
    mdb[req.params.pool].update({_id:docid},req.body.doc,{upsert:true},function(e,d){
        res.send({_id: d._id});
    });

});

app.get('/user/login/:uid/:pwd',function(req,res){
    mdb['WebNG_users'].find({uid:req.params.uid,pwd:req.params.pwd}).nextObject(function(e,d){
        if (d) {
            res.send(d);
        }else{
            res.status(404).send({});
        }
    });
});

var make_passwd = function(n) {
    var a='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var index = (Math.random() * (a.length - 1)).toFixed(0);
    return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
};

app.post('/user/new/',express.bodyParser(),function(req,res){
    req.body.pwd='123456';
    mdb['WebNG_users'].insert(req.body,function(e,d){
        if (e) console.log(e);
        res.end();
    });
});

app.get('/getUserList/',function(req,res){
    mdb['WebNG_users'].find({},{pwd:0}).sort({name: 1}).toArray(function(e,d){
        res.send(d);
    });
});

app.post('/user/pwdChange/',express.bodyParser(),function(req,res){
    mdb['WebNG_users'].update({uid:req.body.uid,pwd:req.body.pwd},{$set:{pwd:req.body.newpwd}},function(e,d){
        console.log(e);
        console.log(d);
    });
});

app.post('/user/aclChange/',express.bodyParser(),function(req,res){
    mdb['WebNG_users'].update({_id:ObjectID(req.body._id)},{$set:{acl:req.body.acl}},function(e,d){
        if (e) console.log(e);
        res.end();
    });
});


app.get('/userPublic/login/:uid/:pwd',function(req,res){
    mdb['publicUserPool'].find({uid:req.params.uid,pwd:req.params.pwd}).nextObject(function(e,d){
        if (d) {
            res.send(d);
        }else{
            res.status(404).send({});
        }
    });
});

app.post('/userPublic/new/',express.bodyParser(),function(req,res){
    mdb['publicUserPool'].insert(req.body,function(e,d){
        if (e) console.log(e);
        res.end();
    });
});