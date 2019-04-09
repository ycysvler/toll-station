import Reflux from 'reflux';
import Config from 'config';

const TestActions = Reflux.createActions([
        'blur',
        'cartwheel',
        'vehicle'
    ]
);


const TestStore = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [TestActions],

    onBlur(file){
        let self = this;
        let url = Config.blur + '/upload';


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
    }
});


export {TestActions, TestStore};