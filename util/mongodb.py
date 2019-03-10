#!/usr/bin/python
# -*- coding: UTF-8 -*-
# pip install pymongo
from pymongo import MongoClient
import config

conn = MongoClient(config.mongodb['host'], config.mongodb['port'])
def db():
    return conn['toll-station']

if __name__ == "__main__":
    db().test.save({'name': 'aa'})
