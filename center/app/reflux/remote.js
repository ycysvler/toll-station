import Reflux from 'reflux';
import Config from 'config';

const Actions = Reflux.createActions([
        'list',
        'online',
        'download'
    ]
);


const Store = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [Actions],


    onOnline(ip, model, version, filename, path){
        let self = this;
        let url =`http://${ip}:4100/api/online?filename=${filename}&model=${model}&version=${version}&path=${path}`;
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

    onDownload(ip,filename){
        let self = this;
        let url =`http://${ip}:4100//api/download?filename=${filename}`;
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

    onList(ip){
        let self = this;
        let url =`http://${ip}:4100/api/version`;
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
