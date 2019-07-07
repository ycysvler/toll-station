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

# 批量计算特征
# status = 0 的计算
def batchFeature():
    faces = mongodb.db('').faces.find({'status': 0})
    for face in faces:
        #print 'batch feature > ', '\033[1;32m ' + str(face["_id"]) + ' \033[0m'
        # 图片路径
        imagepath = 'temp/' + str(face['_id']) + '.jpg'
        file = open(imagepath, 'wb')
        file.write(face['source'])
        file.close()
        # 计算特征
        code,feature = getFeature(imagepath)
        # 删除临时图片
        os.remove(imagepath)
        if code > 0:
            mongodb.db('').faces.update({'_id': face["_id"]},{'$set': {'status': 1, 'feature': feature}})


def run():
    for station in mongodb.db('').stations.find({}):
        ip = station['ip']
        vehicle_result = test(ip, "4000", "vehicle")
        cartwheel_result = test(ip, "4001", "cartwheel")
        blur_result = test(ip, "4002", "blur")

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

def test(ip, port, type):
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

if __name__ == '__main__':
    #batchFeature()
    run()





