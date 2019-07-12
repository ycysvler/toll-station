import Reflux from 'reflux';
import Config from 'config';

const Actions = Reflux.createActions([
        'list',
        'online',
        'download',
        'register',
        'setCenterIp'
    ]
);


const Store = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [Actions],

    onSetCenterIp(ip){
        let self = this;
            let url =`${Config.base}/api/register?ip=${ip}`;
            fetch(url, {
                method: "get",
                credentials: "include"
            })
                .then(response => {
                    response.json().then(function(data){
                        self.trigger('setCenterIp',data);
                    });
                })
                .catch(error => {
                    if (error.response) {
                        cb(null, error.message, error.response.status);
                    } else {
                        cb(null, error.message, 500);
                    }
                });
    },

    onRegister(data){
        let self = this;
                let url = `http://${data.ip}:4101/api/station`;
                let ip = data.ip;

                fetch(url, {
                    headers:{
                        "Content-Type":"application/json",
                    },
                    method: "post",
                    body:JSON.stringify(data),
                    credentials: "include"
                })
                    .then(response => {
                        response.json().then(function(data){
                            self.onSetCenterIp(ip);
                            self.trigger('register',data);
                        });
                    })
                    .catch(error => {
                        if (error.response) {
                            cb(null, error.message, error.response.status);
                        } else {
                            cb(null, error.message, 500);
                        }
                    });
    },

    onOnline(model, version, filename, path){
        let self = this;
        let url =`${Config.base}/api/online?filename=${filename}&model=${model}&version=${version}&path=${path}`;
        fetch(url, {
            method: "get",

            credentials: "include"
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('online',data);
                });
            })
            .catch(error => {
                if (error.response) {
                    cb(null, error.message, error.response.status);
                } else {
                    cb(null, error.message, 500);
                }
            });
    },

    onDownload(filename){
        let self = this;
        let url = Config.base + '/api/download?filename=' + filename;
        fetch(url, {
            method: "get",

            credentials: "include"
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('download',data);
                });
            })
            .catch(error => {
                if (error.response) {
                    cb(null, error.message, error.response.status);
                } else {
                    cb(null, error.message, 500);
                }
            });
    },

    onList(){
        let self = this;
        let url = Config.base + '/api/version';
        fetch(url, {
            method: "get",

        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('list',data);
                });
            })
            .catch(error => {
                if (error.response) {
                    cb(null, error.message, error.response.status);
                } else {
                    cb(null, error.message, 500);
                }
            });
    }

});


export {Actions, Store};
