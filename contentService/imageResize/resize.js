zvar Db = require('mongodb').Db
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

getDBCollection('webNG_SUEU',['WebNG_users','publicUserPool','imagePool','attachmentPool','listPool',
    'imageListPool','docPool','qiyefabuPool','gaoxiaofabuPool',
    'fabustatusPool','parentPool']);

var ossAPI = require('oss-client');
var ossHost='oss.aliyuncs.com';
//  var ossHost='oss-internal.aliyuncs.com';
var oss = new ossAPI.OssClient({host:ossHost,accessKeyId: 'Ybx6lzed1szPRAuI',accessKeySecret: 'yoih8NiSadOlPJ9Syi65w7LdRsc6zA'});


var fs = require('fs'),
    request = require('request');

var download = function(uri, filename){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename));
    });
};

download('https://www.google.com/images/srpr/logo3w.png', 'google.png');

var upload= function (fileId,path){
    oss.putObject({bucket: 'webngimage-small',object: fileId,srcFile: path},
        function (error, result) {
            console.log(fileId + 'uploaded');
        }
    );
};


gm(imagePath)
    .resize(640, 480)
    .autoOrient()
    .flip()
    .write(newImagePath, function(e) {
        if (e) throw e;
        gm(newImagePath)
            .resize(320, 240)
            .write(newImagePathSmall, function(e) {
                if (e) throw e;
                console.log('resized successfuly');
            });
    });