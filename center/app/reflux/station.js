import Reflux from 'reflux';
import Config from 'config';

const Actions = Reflux.createActions([
        'list',
        'create',
        'remove',
        'status'
    ]
);


const Store = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [Actions],

    onStatus(data){
        let self = this;
        let url = Config.base + '/station';

        fetch(url, {
            headers:{
                "Content-Type":"application/json",
            },
            method: "put",
            body:JSON.stringify(data),
            credentials: "include"
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('status',data);
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


    onRemove(data){
        let self = this;
        let url = Config.base + '/station';

        fetch(url, {
            headers:{
                "Content-Type":"application/json",
            },
            method: "delete",
            body:JSON.stringify(data),
            credentials: "include"
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('remove',data);
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

    onCreate(data){
        let self = this;
        let url = Config.base + '/station';

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
                    self.trigger('create',data);
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
        let url = Config.base + '/station';
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