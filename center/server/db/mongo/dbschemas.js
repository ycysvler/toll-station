const config = require('../../config/config');
const mongoose = require('mongoose');

module.exports = class Schemas {
    constructor() {
        let uri = config.mongodb.uri + 'tollstation';
        let conn = mongoose.createConnection(uri, config.mongodb.options);

        conn.then(function (db) {
            console.log("tollstation mongodb connected!");
        });

        // 版本
        this.versionSchema = new mongoose.Schema({
            model: String,                                                      // 模型名称
            version: String,                                                    // 版本信息
            describe: String,                                                   // 描述信息
            filename:String,                                                    // file name
            path:String,							                            // 解压缩位置
            status: {type:Number, default:0},                                   // 状态 0：新建、1：上线、-1：下线
            updatetime: Date                                                    // 更新时间
        });
        this.versionSchema.index({model: 1, version: 1});
        this.Version = conn.model('Version', this.versionSchema);

        // 收费站
        this.stationSchema = new mongoose.Schema({
            ip: String,                                                         // ip
            name: String,                                                       // name
            describe: String,                                                   // 描述信息
            vehicle_status: {type:Number, default:0},                           // 车型状态 0：新建、1：正常、-1：失联
            cartwheel_status: {type:Number, default:0},                         // 车轴状态 0：新建、1：正常、-1：失联
            blur_status: {type:Number, default:0},                              // 模糊状态 0：新建、1：正常、-1：失联
            updatetime: Date                                                    // 更新时间
        });
        this.stationSchema.index({ip: 1});
        this.Station = conn.model('Station', this.stationSchema);
    }
};

