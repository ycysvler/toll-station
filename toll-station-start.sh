
#!/bin/sh
#任务脚本
#进入要执行脚本目录
cd /home/zhq/seeobject/toll-station/src/station/server
#取得root权限，'123456'为密码，不用加引号，'ls'无实际作用
#echo 123456|sudo -S ls
#执行脚本./bin/mywork，sudo -S需要加上
python server.py

