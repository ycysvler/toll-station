#!/usr/bin/env python
# -*- coding: utf-8 -*-
# pip install flask
# pip install flask-cors
# pip install flask_script
# pip3 install requests
# python app.py runserver  -p 8000 -d -r --thread : 使用8000端口，开启debug调试模式，自动重启，使用多线程。

# pip install gunicorn
#  gunicorn -w 4 -b 127.0.0.1:4000 versions:app

import os
import sys
import uuid
import zipfile
import requests
import json
import subprocess
import hashlib
from config import local_root_path,local_models_path

sys.path.append('./util')

from flask import Flask, abort, request,jsonify,render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*')

cfg_file = local_root_path + 'config.ini'

def un_zip(zippath, expath):
    os.system('unzip -o -d ' + expath + ' ' + zippath)
    #f = zipfile.ZipFile(zip,'r')
    #for file in f.namelist():
    #    f.extract(file,expath)

def download_big_file_with_wget(url, target_file_name):
    download_process = subprocess.Popen("wget -c -O "+ target_file_name +" " + url, shell=True)
    download_process.wait()

    if not os.path.exists(target_file_name):
        raise Exception("fail to download file from {}".format(url))

def load_config(): 
    exist = os.path.exists(cfg_file)
    if not exist:
        result = {"config":"config"}
        json.dump(result,open(cfg_file,'w'), indent=4)
    return json.load(open(cfg_file,'r'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stop')
def stop():
    name = request.args.get('name')
    os.system('pm2 stop ' + name)
    return jsonify({"code":200})

@app.route('/api/restart')
def restart():
    name = request.args.get('name')
    os.system('pm2 restart ' + name)
    return jsonify({"code":200})

@app.route('/api/online')
def change():
    path = request.args.get('path')
    model = request.args.get('model')
    version = request.args.get('version')
    filename = request.args.get('filename')

    un_zip(local_models_path + filename, path)

    # 缺少一个停服务,启服务
    os.system('pm2 restart ' + model)

    cfg = load_config()
    cfg[model] = version    
    json.dump(cfg,open(cfg_file,'w'), indent=4) 
    return jsonify({"code":200})

@app.route('/api/download')
def download():
    cfg = load_config()

    filename = request.args.get('filename')
    # 目录不存在，创建目录
    if not os.path.exists(local_models_path):
        os.makedirs(local_models_path)
    # 下载文件
    download_big_file_with_wget(cfg['center_base'] + '/models/' + filename,local_models_path + filename)
    return jsonify({"code":200, "filename":filename})

@app.route('/api/register', methods=['POST'])
def register():
    data = str(request.data, encoding = "utf-8")
    j_data =  json.loads(data)
    ip =  j_data['ip']
    cfg = load_config()
    cfg['center_base'] = "http://" + ip + ":4101"
    # 服务器IP保存到配置文件
    json.dump(cfg,open(cfg_file,'w'), indent=4)

    # 向服务器发起注册
    try:
        res = requests.post("http://" +ip + ':4101/api/station',
                               data={"describe":j_data["describe"],"name":j_data["name"]},
                               timeout=5)

        result = res.json()

        if result['error_code'] == 0:
            return jsonify({"code":200})
        else:
            return jsonify({"code":500,"message":result["message"]})


    except requests.exceptions.ConnectionError as e1:
        return jsonify({"code":500,"message":"IP地址无法访问！"})







@app.route('/api/version')
def versions():
    config = load_config()

    result = requests.get(config['center_base'] + '/api/version').json()

    for item in result['data']:
        # check model file is exist
        filename = item['filename']
        exist = os.path.exists(local_models_path + filename)
        item['exist'] = exist
        item['local'] = False
        
        # check local is the version
        if item['model'] in config:
            if config[item['model']] == item['version'] :
                item['current'] = True

    list = []
    for item in result['data']:
        if item['status'] == 1:
            list.append(item)

    result['data'] = list
    return jsonify(result)

def verify():
    global verifyed
    if verifyed:
        return True
    else:
        try:
            res = requests.get("http://localhost:4587/verify")
            json = res.json()
            if json["code"] == 200:
                verifyed = True
                return True
            else:
                return False
        except:
            return False

verifyed = False

if __name__ == "__main__":
    verify()

    app.run(host='0.0.0.0',port=4100)


