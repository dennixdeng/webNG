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
