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
const StationLogic = require('../../db/mongo/dao/station');
const logic = new StationLogic();

function getIP(req){
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if(ip && ip.length > 0){
        let strs = ip.split(':');
        if(strs.length > 0){
            ip = strs[strs.length - 1];
        }
    }
    return ip;
}

module.exports = function (router) {
    router.post('/station', async(ctx) => {
        let ip = getIP(ctx.req);

        let ok = tools.required(ctx, ["name"]);
        if (ok) {
            let error_code = 0;
            let data = null;
            let error_msg = null;
            let body = ctx.request.body;
            body['ip'] = body.ip ? body.ip : ip;

            data = await logic.create(body).catch(function (err) {
                error_code = err.code;
                error_msg = err.errmsg;
            });

            console.log("data", data);

            ctx.body = error_code ?
                {error_code: error_code, error_msg} :
                {error_code: error_code, data: data};
        }
    });

    // 获取列表
    router.get('/station', async(ctx) => {
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

    // 获取监控信息
    router.get('/monitor', async(ctx) => {
        let error_code = 0;
        let data = null;
        let error_msg = null;

        let req_query = ctx.request.query;
        console.log('req_query', req_query);

        data = await logic.monitor(req_query).catch(function (err) {
            error_code = err.code;
            error_msg = err.errmsg;
        });

        ctx.body = error_code ?
            {error_code: error_code, error_msg} :
            {error_code: error_code, data: data};
    });


    router.delete('/station', async(ctx) => {
        let ok = tools.required(ctx, ["_id"]);
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

    router.put('/station', async(ctx)=>{
        let ok = tools.required(ctx, ["_id","status"]);
        if (ok) {
            let error_code = 0;
            let data = null;
            let error_msg = null;

            data = await logic.status(ctx.request.body).catch(function (err) {
                error_code = err.code;
                error_msg = err.errmsg;
            });

            ctx.body = error_code ?
                {error_code: error_code, error_msg} :
                {error_code: error_code};
        }
    });
};