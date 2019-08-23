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
        return False
    else:
        if res.status_code != 200:
            print(ip, '\tversion:',res.status_code)
            return False
        bean = json.loads(res.text)
        if bean['error_code'] == 0:
            for item in bean['data']:
                if 'current' in item and item['current']:
                    stations.update({'_id':id},{'$set':{item['model'] + '_version':item['version']}})
                    print(item['model'], item['version'])

''' 获取CPU的型号和CPU的核心数 '''
def getCpu():
    num = 0
    with open('/proc/cpuinfo') as fd:
        for line in fd:
            if line.startswith('processor'):
                num += 1
            if line.startswith('model name'):
                cpu_model = line.split(':')[1].strip().split()
                cpu_model = cpu_model[0] + ' ' + cpu_model[2]  + ' ' + cpu_model[-1]

    print(num, cpu_model)
    return {'cpu_num':num, 'cpu_model':cpu_model}

def test():
    cmd = "/usr/sbin/system_profiler SPHardwareDataType | fgrep 'Serial' | awk '{print $NF}'"
    output = os.popen(cmd)
    print(output.read())

if __name__ == '__main__':
    #getCpu()
    #test()

    while True:
        run()
        time.sleep(60)




