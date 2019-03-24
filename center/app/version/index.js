/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu, Icon } from 'antd';
import {Actions, Store} from '../reflux';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export default class Version extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));

        Actions.test();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        if (window.screen.width > 1920) {
            document.body.style.zoom = window.screen.width / 1920;
        }
    }

    onStatusChange(action, data){

    }

    render() {
        return (
            <Layout>
                <Sider width={250} style={{"background":"#fff"}}>
                    <Menu>

                        <Menu.Item key="alipay9">
                            <Link to="/main/face/faces"> <Icon type="laptop" />版本管理</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{borderLeft:'solid 1px #e8e8e8'}}>

                </Layout>
            </Layout>
        );
    }
}