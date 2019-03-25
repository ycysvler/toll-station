/**
 * Created by VLER on 2018/10/25.
 */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const request = require('request');
const tools = require('../../utils/tools');
const uploadFile = require('../../utils/upload');
const Config = require('../../config/config');
const VersionLogic = require('../../db/mongo/dao/version');
const logic = new VersionLogic();

module.exports = function (router) {

    /*
    * 添加分组
    * { "group_id":"22", "desc":"这是一个测试用的分组" }
    * */
    router.post('/version', async(ctx) => {
        let ok = tools.required(ctx, ["version","model"]);
        if (ok) {
            let error_code = 0;
            let data = null;
            let error_msg = null;

            data = await logic.create(ctx.request.body).catch(function (err) {
                error_code = err.code;
                error_msg = err.errmsg;
            });

            ctx.body = error_code ?
                {error_code: error_code, error_msg} :
                {error_code: error_code, data: data};
        }
    });

    /*
    * 添加分组
    * { "group_id":"22", "desc":"这是一个测试用的分组" }
    * */
    router.post('/upload', async(ctx) => {
        if (true) {
            let serverFilePath = path.join(__dirname, '../../public');

            // 上传文件事件
            let f = await uploadFile(ctx, {
                path: serverFilePath
            });

            console.log('f',f);
            // 文件名
            let filename = path.basename(f.path);
            ctx.body = {code: 200, data: filename};
        }
    });


    // 获取分组列表
    router.get('/version', async(ctx) => {
        let error_code = 0;
        let data = null;
        let error_msg = null;

        data = await logic.list().catch(function (err) {
            error_code = err.code;
            error_msg = err.errmsg;
        });

        ctx.body = error_code ?
            {error_code: error_code, error_msg} :
            {error_code: error_code, data: data};
    });

    /*
    * 删除分组
    * { "group_id":"1" }
    * */
    router.delete('/faceset/group/delete', async(ctx) => {
        let ok = tools.required(ctx, ["group_id"]);
        if (ok) {
            let error_code = 0;
            let data = null;
            let error_msg = null;

            data = await logic.remove(ctx.request.body).catch(function (err) {
                error_code = err.code;
                error_msg = err.errmsg;
            });

            ctx.body = error_code ?
                {error_code: error_code, error_msg} :
                {error_code: error_code};
        }
    });

    /*
     * 删除分组
     * { "group_id":"1" }
     * */
    router.delete('/faceset/group/deleteids', async(ctx) => {
        if (true) {
            let error_code = 0;
            let data = null;
            let error_msg = null;

            data = await logic.removeByIds(ctx.request.body).catch(function (err) {
                error_code = err.code;
                error_msg = err.errmsg;
            });

            ctx.body = error_code ?
                {error_code: error_code, error_msg} :
                {error_code: error_code};
        }
    });


    // 重建索引
    router.post('/faceset/group/buildindex', async (ctx) => {
        let ok = tools.required(ctx, ["group_id"]);
        if (ok) {
            let error_code = 0;
            let data = null;
            let error_msg = null;

            let group_id = ctx.request.body['group_id'];

            console.log(`path :\t\x1B[33m/faceset/group/buildindex \t \x1B[0m \x1B[36m { group_id : ${group_id}}  \x1B[0m`);

            // 计算图片特征, python 那边计算特征
            let options = {
                method: 'get',
                url: `${Config.server.service.uri}/buildindex?group_id=${group_id}`,
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: {}
            };

            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    error_code = err;
                    ctx.body = {error_code: error_code, error_msg:err.Error};
                }else{
                    console.log(body);
                    ctx.body = {error_code: error_code, data: {group_id:group_id}};
                }
            });

        }
    });
};