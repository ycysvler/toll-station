/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu, Icon ,Table} from 'antd';
import {Actions, Store} from '../reflux';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export default class Version extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));
        this.state = {list:[]};
        Actions.list();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {

    }

    onStatusChange(action, data){
        switch(action){
            case "list":
                this.setState({list:data.data});
                console.log('data', data);
                break;
        }
    }

    columns = [{
        title: '模型',
        dataIndex: 'model',
        key: 'model',
    }, {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
    }, {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
    }];

    render() {
        return (
            <Layout>

                <Layout style={{borderLeft:'solid 1px #e8e8e8',padding:16}}>
                    <Table rowKey="_id" dataSource={this.state.list} columns={this.columns} />
                </Layout>
            </Layout>
        );
    }
}