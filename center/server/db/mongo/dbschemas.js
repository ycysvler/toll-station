const config = require('../../config/config');
const mongoose = require('mongoose');

module.exports = class Schemas {
    constructor() {
        let uri = config.mongodb.uri + 'tollstation';
        let conn = mongoose.createConnection(uri, config.mongodb.options);

        conn.then(function (db) {
            console.log("tollstation mongodb connected!");
        });

        // 用户组
        this.versionSchema = new mongoose.Schema({
            model: String,                                                      // 模型名称
            version: String,                                                    // 版本信息
            describe: String,                                                   // 描述信息
            filename:String,                                                    // file name
            status: {type:Number, default:0},                                   // 状态 0：新建、1：上线、-1：下线
            updatetime: Date                                                    // 更新时间
        });
        this.versionSchema.index({model: 1, version: 1});
        this.Version = conn.model('Version', this.versionSchema);
    }
};

