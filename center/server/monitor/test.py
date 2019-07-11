#coding=utf-8
# -*- coding: UTF-8 -*-
import os
import time
import json
import config
import mongodb
import requests
import bson.binary

from bson.objectid import ObjectId


def run():
    for station in mongodb.db('').stations.find({}):
        ip = station['ip']

        # 检查一下接口能不能调用通
        vehicle_result = postImage(ip, "4000", "vehicle")
        cartwheel_result = postImage(ip, "4001", "cartwheel")
        blur_result = postImage(ip, "4002", "blur")

        print(ip, '\tvehicle:',vehicle_result, '\tcartwheel:',cartwheel_result, '\tblur:',blur_result)

        if vehicle_result:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'vehicle_status':1}})
        else:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'vehicle_status':-1}})

        if cartwheel_result:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'cartwheel_status':1}})
        else:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'cartwheel_status':-1}})

        if blur_result:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'blur_status':1}})
        else:
            mongodb.db('').stations.update({'_id':station['_id']},{'$set':{'blur_status':-1}})

        # 检查一下客户端在使用的版本
        getStationVersion(station['_id'], ip)

def postImage(ip, port, type):
    files = {"image":open("./"+type+".jpg", "rb")}
    try:
        res = requests.post('http://'+ip+':' + port +'/upload',None,files=files)
    except Exception as e:
        return False
    else:
        bean = json.loads(res.text)
        if bean != None:
            if bean['code'] == 200:
                return True
            else:
                return False
        else:
            return True

def getStationVersion(id, ip):

    stations = mongodb.db('').stations

    try:
        #http://localhost:4100/api/version
        res = requests.get('http://' + ip + ':4100/api/version')
    except Exception as e:
        print(e)
        return False
    else:
        bean = json.loads(res.text)
        if bean['error_code'] == 0:
            for item in bean['data']:
                if 'current' in item and item['current']:
                    stations.update({'_id':id},{'$set':{item['model'] + '_version':item['version']}})
                    print(item['model'], item['version'])

if __name__ == '__main__':
    run()
    #getStationVersion('127.0.0.1')




