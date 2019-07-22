import requests

def get_model_versions():
    response = requests.get('http://localhost:4587/verify')
    versions = response.json()
    print (versions)
    print (versions['code'])
    print (len(versions))
    #print ('info\t>', versions[0]['info'])
    #print ('id\t>', versions[0]['id'])

if __name__ == '__main__':
    get_model_versions()
