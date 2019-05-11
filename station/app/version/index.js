/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Menu, Divider, Icon, Button, Table, Spin} from 'antd';
import VersionInfo from './info';
import {Actions, Store} from '../reflux';

const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

export default class Version extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));
        this.state = {list: []};

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        this.refresh();
    }

    onStatusChange(action, data) {
        switch (action) {
            case "list":
                this.setState({list: data.data, loading:false});
                break;
            case "download":
            case "online":
            case "remove":
            case "status":
                this.refresh();
                break;
        }
    }

    refresh = () => {
        this.setState({modal: false});
        Actions.list();
    };

    columns = [{
        title: '模型',
        dataIndex: 'model',
        key: 'model',
    }, {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
    }, {
        title: '文件',
        dataIndex: 'filename',
        key: 'filename',
    }, {
        title: '已下载',
        dataIndex: 'exist',
        key: 'exist',
        render: (text, record) => {
            return <span>{text ? "Y" : "N"}</span>
        }
    },
        {
            title: '正在用',
            dataIndex: 'current',
            key: 'current', render: (text, record) => {
                return <span>{text ? "Y" : "N"}</span>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return <span>
                {record.current ? null : <a href={"javascript:;"}
                                     onClick={() => {
                                         this.setState({loading:true});
                                         Actions.online(
                                             record.model, record.version, record.filename,record.path
                                         );
                                     }}
                >启动</a>}
                    {record.current ? null : <Divider type="vertical"/>}
                    {record.exist ? null:<a href="javascript:;"
                       onClick={() => {
                           this.setState({loading:true});
                           Actions.download(record.filename);
                       }}
                    >下载</a>}
            </span>
            }
        }];

    render() {
        return (
            <Layout>

                <Layout style={{borderLeft: 'solid 1px #e8e8e8', padding: 16}}>
                    <div style={{paddingBottom: 16}}><Button icon="plus" type="primary" style={{marginRight:16}}
                                                             onClick={() => {
                                                                 this.setState({"modal": true})
                                                             }}
                    >Add</Button> {this.state.loading?<Spin  />:null} </div>

                    <Table bordered rowKey="_id" dataSource={this.state.list} columns={this.columns}/>

                    <VersionInfo refresh={this.refresh} showModal={this.state.modal}/>
                </Layout>
            </Layout>
        );
    }
}
