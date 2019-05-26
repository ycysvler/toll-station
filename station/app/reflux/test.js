import Reflux from 'reflux';
import Config from 'config';

const TestActions = Reflux.createActions([
        'blur',
        'cartwheel',
        'vehicle',
        'vehicleList',
    'cartwheelList',
    'detectblurList'
    ]
);


const TestStore = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [TestActions],

    onBlur(file){
        let self = this;
        // let url = Config.blur + '/upload';

        let url = `http://${document.domain}:4002`+ '/upload';


        let formFile = new FormData();
        formFile.append("image", file, file.name);

        fetch(url, {
            method: "post",
            body:formFile
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('blur',data);
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

    onCartwheel(file){
        let self = this;
        // let url = Config.cartwheel + '/upload';
        let url = `http://${document.domain}:4001`+ '/upload';

        let formFile = new FormData();
        formFile.append("image", file, file.name);

        fetch(url, {
            method: "post",
            body:formFile
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('cartwheel',data);
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
    onVehicle(file){
        let self = this;
        // let url = Config.vehicle + '/upload';
        let url = `http://${document.domain}:4000`+ '/upload';

        let formFile = new FormData();
        formFile.append("image", file, file.name);

        fetch(url, {
            method: "post",
            body:formFile
        })
            .then(response => {
                response.json().then(function(data){
                    self.trigger('vehicle',data);
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

    onVehicleList(name){
        let self = this;
        let url = `http://${document.domain}:4101`+ '/api/test/vehicle';
        fetch(url, {
            method:'get'
        }).then(res=>{
            res.json().then((data)=>{
                self.trigger('vehicleList', data);
            });
        })
    },

    onCartwheelList(name){
        let self = this;
        let url = `http://${document.domain}:4101`+ '/api/test/cartwheel';
        fetch(url, {
            method:'get'
        }).then(res=>{
            res.json().then((data)=>{
                self.trigger('cartwheelList', data);
            });
        })
    },

    onDetectblurList(name){
        let self = this;
        let url = `http://${document.domain}:4101`+ '/api/test/detectblur';
        fetch(url, {
            method:'get'
        }).then(res=>{
            res.json().then((data)=>{
                self.trigger('detectblurList', data);
            });
        })
    }
});


export {TestActions, TestStore};