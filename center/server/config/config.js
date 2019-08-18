/**
 * 全局配置文件
 *
 * Created by zhanghongqing on 2018/6/29.
 */

module.exports = {
    // mongodb 相关配置
    mongodb: {
        uri: 'mongodb://localhost/',
        options: {
            useNewUrlParser:true,
            auto_reconnect: true,
            poolSize: 10
        }
    }, 
    // server 相关配置
    server: {
        port: 4101
    }
};

