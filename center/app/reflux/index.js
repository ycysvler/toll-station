import Reflux from 'reflux';
import Config from 'config';

const Actions = Reflux.createActions([
        'list',
        'viewer',
        'locList',
        'portalUserList',
        'portalUserRemove',
        'portalAddVideo',
    'test'
    ]
);


const Store = Reflux.createStore({
    state: {
        admin: {}
    },

    listenables: [Actions],

    onList(){
        let self = this;
        let url = Config.base + '/version';
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
    },

    onTest(cb){
        console.log('Config', Config);
        fetch(url, {
            method: "get",
            credentials: "include"
        })
            .then(body => {
                 console.log('body', body);
            })
            .catch(error => {
                if (error.response) {
                    cb(null, error.message, error.response.status);
                } else {
                    cb(null, error.message, 500);
                }
            });
    },

    onPortalAddVideo:function(video){
        let self = this;

        let query = `mutation{
                  portalMutation{
                    addVideo(userIds:${JSON.stringify(video.userIds)}, title:"${video.title}", path:"${video.path}", city:"${video.city}", position:"${video.position}", tagList:${JSON.stringify(video.tagList)}, isAd:false, adPath:"")
                  }
                }`;

        Common.graphql({query}, (json, error, httpStatus) => {
            if (httpStatus === 200) {
                self.trigger('portalAddVideo', json.data.portalMutation.addVideo);
            } else {
                self.trigger('global-message',{type:'error', message:error});
            }
        });
    },

    onPortalUserRemove: function(userId) {
        let self = this;

        let query = `mutation{
                  portalMutation{
                    removeUser(userId:"${userId}")
                  }
                }`;

        Common.graphql({query}, (json, error, httpStatus) => {
            if (httpStatus === 200) {
                self.trigger('portalUserRemove', json.data.portalMutation.removeUser);
            } else {
                self.trigger('global-message',{type:'error', message:error});
            }
        });
    },

    onPortalUserList: function() {
        let self = this;

        let query = `{
              portalQuery{
                userList{
                  id 
                  fullName
                  avatar
                  createTime
                  updateTime
                  gender
                  followerList{
                    count
                  }
                  identityList{
                    name
                    type
                    isVerified
                  }
                }
              }
            }`;

        Common.graphql({query}, (json, error, httpStatus) => {
            if (httpStatus === 200) {
                self.state.portalUserList = json.data.portalQuery.userList;
                self.trigger('portalUserList', this.state.portalUserList);
            } else {
                self.state.portalUserList = [];
                self.trigger('global-message',{type:'error', message:error});
            }
        });
    },

    onLocList: function () {
        let self = this;
        if (self.state.loclist) {
            self.trigger('auth', self.state.loclist);
        } else {
            Common.get('/static/json/city.json', (json, error, status) => {
                if (status === 200) {
                    self.state.loclist = json;
                    self.trigger('locList', self.state.loclist);
                    // 这是一条测试全局通知的代码
                    // self.trigger('global-message',{type:'success', message:'haha'});
                }
            });
        }

    },

    onViewer:function(){
        let self = this;

        let query = `{
        adminQuery{
            viewer(){
              id
              portalId
              fullName
              avatar
              createTime
              updateTime
              gender
              identityList{
                name
                type
                isVerified
              }
            }
          }
        }`;

        Common.graphql({query}, (json, error, httpStatus) => {
            if (httpStatus === 200) {
                this.state.admin = json.data.adminQuery.viewer;
                self.trigger('auth', this.state.admin);
            } else {
                this.state.admin = null;
                self.trigger('error', error);
            }
        });
    },

    onAuth: function (identity, password) {
        let self = this;

        let query = `{
        adminQuery{
            auth(identity:"${identity}", password:"${password}"){
              id
              portalId
              fullName
              avatar
              createTime
              updateTime
              gender
              identityList{
                name
                type
                isVerified
              }
            }
          }
        }`;

        Common.graphql({query}, (json, error, httpStatus) => {
            if (httpStatus === 200) {
                this.state.admin = json.data.adminQuery.auth;
                self.trigger('auth', this.state.admin);
            } else {
                this.state.admin = null;
                self.trigger('error', "用户名或密码错误！");
            }
        });
    },
});


export {Actions, Store};