import os
import subprocess
def download_big_file_with_wget(url, target_file_name):
    download_process = subprocess.Popen("wget -c -O "+ target_file_name +" " + url, shell=True)

    download_process.wait()

    if not os.path.exists(target_file_name):
        raise Exception("fail to download file from {}".format(url))


if __name__ == '__main__':
    url = "http://localhost:8080/static/1.jpg"
    target = "./2.jpg"
    download_big_file_with_wget(url, target)