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

    onOnline(model, version, filename){
        let self = this;
        let url =`${Config.base}/api/online?filename=${filename}&model=${model}&version=${version}`;
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

            credentials: "include"
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