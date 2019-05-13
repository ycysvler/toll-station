#!/usr/bin/python
# -*- coding: UTF-8 -*-
# pip install pymongo
from pymongo import MongoClient

conn = MongoClient('localhost', 27017)
def db():
    return conn['test']

if __name__ == "__main__":
    db().test.save({'name': 'aa'})
    db().pchar.save({'image':'pp1.jpg', "data":[{"label":'11', "x1":202, "y1":233, "x2":235, "y2":258}]})
