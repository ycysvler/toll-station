import Reflux from 'reflux';
import Config from 'config';

const Actions = Reflux.createActions([
        'list',
        'verify',
        'online',
        'download',
        'register',
        'serial',
        'secret',
        'checkPwd',
        'setCenterIp',
        'message'

    ]
);


const Store = Reflux.createStore({
    state: {
        verify:false
    },

    listenables: [Actions],

    onVerify(){
    let self = this;

    if(this.state.verify){
        self.trigger('verify', {code:200, message:"ok"});
        return;
    }


    let url = `${Config.dongle}/verify`;
                fetch(url, {
                    method: "get",
                }).then(response => {
                    response.json().then(function (data) {
                    if(data.code === 200){
                        self.state.verify = true;
                    }
                    self.trigger('verify', data);

                    });
                }).catch(error => {
                    this.onMessage('warning', "守护进程无法访问！");
                });
    },

    onSecret(secret){
    let self = this;
            let url = Config.dongle + '/secret?secret=' + secret['password'];
            fetch(url, {
                method: "get",

            }).then(response => {
                response.json().then(function (data) {
                    self.trigger('secret', data);
                });
            }).catch(error => {
                if (error.response) {
                    cb(null, error.message, error.response.status);
                } else {
                    cb(null, error.message, 500);
                }
            });
    },

    onSerial() {
        let self = this;
        let url = Config.dongle + '/serial';
        fetch(url, {
            method: "get",

        }).then(response => {
            response.json().then(function (data) {
                self.trigger('serial', data.message);
            });
        }).catch(error => {

        });
    },

    onCheckPwd(pwd) {
        let self = this;
        let url = `${Config.base}/api/verify?pwd=${pwd}`;
        fetch(url, {
            method: "get",
            credentials: "include"
        }).then(response => {
            response.json().then(function (data) {
                self.trigger('checkPwd', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });

    },

    onMessage(type, message){
        this.trigger("message", {type:type, message:message});
    },


    onSetCenterIp(ip) {
        let self = this;
        let url = `${Config.base}/api/register?ip=${ip}`;
        fetch(url, {
            method: "get",
            credentials: "include"
        }).then(response => {
            response.json().then(function (data) {
                self.trigger('setCenterIp', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });
    },

    onRegister(data) {
        let self = this;
        let url = `${Config.base}/api/register`;
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify(data),
            credentials: "include"
        }).then(response => {
            response.json().then(function (data) {
                self.trigger('register', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });
    },

    onOnline(model, version, filename, path) {
        let self = this;
        let url = `${Config.base}/api/online?filename=${filename}&model=${model}&version=${version}&path=${path}`;
        fetch(url, {
            method: "get",

            credentials: "include"
        }).then(response => {
            response.json().then(function (data) {
                self.trigger('online', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });
    },

    onDownload(filename) {
        let self = this;
        let url = Config.base + '/api/download?filename=' + filename;
        fetch(url, {
            method: "get",
            credentials: "include"
        }).then(response => {
            response.json().then(function (data) {
                self.trigger('download', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });
    },

    onList() {
        let self = this;
        let url = Config.base + '/api/version';
        fetch(url, {
            method: "get",

        }).then(response => {
            response.json().then(function (data) {
                self.trigger('list', data);
            });
        }).catch(error => {
            if (error.response) {
                cb(null, error.message, error.response.status);
            } else {
                cb(null, error.message, 500);
            }
        });
    }

});


export {Actions, Store};
