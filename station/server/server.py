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
import zipfile
import requests
import json
import subprocess
from config import center_base, model_base

sys.path.append('./util')

from flask import Flask, abort, request,jsonify,render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*')

def un_zip(zip, expath):
    f = zipfile.ZipFile(zip,'r')
    for file in f.namelist():
        f.extract(file,expath)

def download_big_file_with_wget(url, target_file_name):
    download_process = subprocess.Popen("wget -c -O "+ target_file_name +" " + url, shell=True)

    download_process.wait()

    if not os.path.exists(target_file_name):
        raise Exception("fail to download file from {}".format(url))

def load_config():
    cfg_file = './config.ini'
    exist = os.path.exists(cfg_file)
    if not exist:
        result = {"config":"config"}
        json.dump(result,open(cfg_file,'w'), indent=4)
    return json.load(open(cfg_file,'r'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/online')
def change():
    model = request.args.get('model')
    version = request.args.get('version')
    filename = request.args.get('filename')

    un_zip('./static/models/'+filename, model_base)

    # 缺少一个停服务,启服务

    cfg = load_config()
    cfg[model] = version
    cfg_file = './config.ini'
    json.dump(cfg,open(cfg_file,'w'), indent=4)

    print('version',version)
    return jsonify({"code":200})

@app.route('/api/download')
def download():
    filename = request.args.get('filename')
    download_big_file_with_wget(center_base + '/models/' + filename,'./static/models/' + filename)
    return jsonify({"code":200, "filename":filename})

@app.route('/api/version')
def versions():
    result = requests.get(center_base + '/api/version').json()
    config = load_config()


    for item in result['data']:
        # check model file is exist
        filename = item['filename']
        exist = os.path.exists('./static/models/'+filename)
        item['exist'] = exist
        item['local'] = False
        # check local is the version
        if item['model'] in config:
            if config[item['model']] == item['version'] :
                item['current'] = True

    print('result', result)

    return jsonify(result)
    # 返回所有版本，本地有没有压缩包，正在使用的版本
    #return jsonify([{"version":"1.0","local":False, "current":False},{"version":"2.0","local":True, "current":True}])


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8000)

