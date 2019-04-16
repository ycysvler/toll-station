#!/usr/bin/env python
# -*- coding: utf-8 -*-
# pip install Flask

# pip intall flask_script
# python app.py runserver  -p 8000 -d -r --thread : 使用8000端口，开启debug调试模式，自动重启，使用多线程。

# pip install gunicorn
#  gunicorn -w 4 -b 127.0.0.1:4000 versions:app

from flask import Flask, abort, request,jsonify
from flask_script import Manager
from multiprocessing import Process, Pipe
import time

app = Flask(__name__)

app_conn, service_conn = Pipe()


#manager = Manager(app)

def service_process():
    while True:
        imagepath = service_conn.recv()
        service_conn.send(imagepath + "haha" )

process = Process(target=service_process)

@app.route('/quit')
def quit():
    process.terminate()
    task = {
        'id': "23",
        'info': "quit"
    }
    return jsonify(task)
    #process.stop()

@app.route('/versions')
def hello_world():
    app_conn.send("aa ")
    result = app_conn.recv() 

    return jsonify({"data":result})


if __name__ == "__main__":
    # 这种是不太推荐的启动方式，我这只是做演示用，官方启动方式参见：http://flask.pocoo.org/docs/0.12/quickstart/#a-minimal-application
    process.start()
    app.run()
