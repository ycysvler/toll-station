#!/usr/bin/env python
# -*- coding: utf-8 -*-
# pip install flask
# pip install flask-cors
# pip install flask_script
# python app.py runserver  -p 8000 -d -r --thread : 使用8000端口，开启debug调试模式，自动重启，使用多线程。

# pip install gunicorn
#  gunicorn -w 4 -b 127.0.0.1:4000 versions:app

import sys

sys.path.append('./util')

from flask import Flask, abort, request,jsonify,render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/change')
def change():
    version = request.args.get('version')
    print('version',version)
    return jsonify({"code":200})

@app.route('/download')
def download():
    version = request.args.get('version')
    print('version',version)
    return jsonify({"code":200})

@app.route('/models')
def models():
    # 返回所有版本，本地有没有压缩包，正在使用的版本
    return jsonify([{"version":"1.0","local":False, "current":False},{"version":"2.0","local":True, "current":True}])

@app.route('/pchars')
def pchars():
    image = request.args.get('image')
    print (image)
    para = {}
    if image == None:
        para = {}
    else:
        para = {"image":image}

    print('para',para)


    return jsonify(para)


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8000)
