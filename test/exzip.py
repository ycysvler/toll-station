import zipfile
def un_zip(zip, expath):
    f = zipfile.ZipFile(zip,'r')
    for file in f.namelist():
        f.extract(file,expath)


if __name__ == '__main__':
    zip = "./refluxjs-master.zip"
    expath = "./unzip/"
    un_zip(zip, expath)