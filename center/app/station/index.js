/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import { Layout,Menu,Tag, Icon ,Button,Table} from 'antd';
import {Actions, Store} from '../reflux/station';
import StationInfo from './info';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export default class Station extends React.Component {
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
        Actions.list();
        setInterval(this.refresh, 60 * 1000);

    };

    columns = [{
        title: '状态',
        width:120,
        dataIndex: 'status',
        key: 'status',
        render:(text, record)=>{
            switch(record.status){
                case 0:return <Tag color="#2db7f5">新增</Tag>;
                case 1:return <Tag color="#87d068">正常</Tag>;
                case -1:return <Tag color="#f50">失联</Tag>;
                case -2:return <Tag color="#f50">异常</Tag>;
            }
        }
    }, {
        title: '地址',
        dataIndex: 'ip',
        key: 'ip',
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
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
                       Actions.remove({_id:record._id})
                   }}
                >delete</a>
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
                    <StationInfo
                        complete={()=>{this.refresh();this.setState({modal:false});}}
                        showModal={this.state.modal} />
                </Layout>
            </Layout>
        );
    }
}