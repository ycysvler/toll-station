const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class StationLogic {
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Station;

                Doc.findOne({'ip':data.ip}, (err, station)=>{

                    if(!station){
                        let item = new Doc(data);
                        item.updatetime = new moment();
                        item.save(async(err, item) => {
                            if (!err) {
                                resolve(item);
                            } else {
                                reject(err);
                            }
                        });
                    }else{
                        let item = {};
                        item['name'] = data.name ? data.name:station.name;
                        item['describe'] = data.describe ? data.describe:station.describe;
                        item['status'] = data.status ? data.status:station.status;
                        Doc.update({ip: data.ip}, item, function (err, Item) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(Item);
                            }
                        });

                        resolve(station);
                    }
                });


            } catch (err) {
                reject(err);
            }
        });
    }

    list(){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Station;
            doc.find({}).exec((err, results)=>{
                if(err){reject(err);}
                else{resolve(results);}
            });
        });
    }

    remove(data) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Station;
            doc.deleteMany({_id: data._id}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    status(data){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Station;
            doc.update({_id: data._id},{status:data.status}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    removeByIds(ids) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Station;
            doc.deleteMany({_id: {$in: ids}}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};