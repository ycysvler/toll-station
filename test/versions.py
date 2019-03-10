#!/usr/bin/env python
# -*- coding: utf-8 -*-
# pip install Flask
# pip intall flask_script
from flask import Flask, abort, request,jsonify
from flask_script import Manager

app = Flask(__name__)

manager = Manager(app)

@app.route('/versions')
def hello_world():
    task = {
        'id': "23",
        'info': "jodany"
    }

    tasks = []
    tasks.append(task)

    return jsonify(tasks)


if __name__ == "__main__":
    # 这种是不太推荐的启动方式，我这只是做演示用，官方启动方式参见：http://flask.pocoo.org/docs/0.12/quickstart/#a-minimal-application
    manager.run()