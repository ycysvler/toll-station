const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class GroupLogic {
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Version;
                let item = new Doc(data);
                item.updatetime = new moment();
                item.save(async(err, item) => {
                    if (!err) {
                        resolve(item);
                    } else {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    list(){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Version;
            doc.find({}).exec((err, results)=>{
                if(err){reject(err);}
                else{resolve(results);}
            });
        });
    }

    remove(data) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Group;
            doc.deleteMany({group_id: data.group_id}, function (err, Item) {
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
            let doc = getMongoPool().Group;
            doc.deleteMany({group_id: {$in: ids}}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};