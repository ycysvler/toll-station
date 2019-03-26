/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu,Divider, Icon ,Button,Table} from 'antd';
import VersionInfo from './info';
import {Actions, Store} from '../reflux';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export default class Version extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));
        this.state = {list:[]};

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        this.refresh();
    }

    onStatusChange(action, data){
        switch(action){
            case "list":
                this.setState({list:data.data});
                break;
            case "remove":
            case "status":
                this.refresh();
                break;
        }
    }

    refresh=()=>{
        this.setState({modal:false});
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
        title: 'file',
        dataIndex: 'filename',
        key: 'filename',
    },{
        title: 'local',
        dataIndex: 'exist',
        key: 'exist',
        render:(text,record)=>{
            return <span>{text.toString()}</span>
        }
    },
        {
        title: 'current',
        dataIndex: 'current',
        key: 'current', render:(text,record)=>{
            return <span>{text}</span>
        }
    },{
        title: 'status',
        dataIndex: 'status',
        key: 'status',
    },{
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
    },{
        title: 'action',
        key: 'action',
        render:(text,record)=>(
            <span>
                <a href={"javascript:;"}
                   onClick={()=>{
                       Actions.status({_id:record._id, status:1})
                   }}
                >up</a>
            </span>
        )
    }];

    render() {
        return (
            <Layout>

                <Layout style={{borderLeft:'solid 1px #e8e8e8',padding:16}}>
                    <div style={{paddingBottom:16}}><Button icon="plus" type="primary"
                    onClick={()=>{this.setState({"modal":true})}}
                    >Add</Button></div>

                    <Table bordered rowKey="_id" dataSource={this.state.list} columns={this.columns} />

                    <VersionInfo refresh={this.refresh} showModal={this.state.modal} />
                </Layout>
            </Layout>
        );
    }
}