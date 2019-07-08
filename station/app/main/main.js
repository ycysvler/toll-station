/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import moment from 'moment';
import Version from '../version';
import Test from '../test';
import {Layout, Badge, Dropdown, Button, Divider, notification, Menu, message, Modal, Avatar, Row, Col} from 'antd';
import {NotFound} from '../notfound';

import './main.less';

const {Header, Footer, Sider, Content} = Layout;

const SubMenu = Menu.SubMenu;

export class Main extends React.Component {

    constructor(props) {
        super(props);
        moment.locale('zh-cn');

        let url = window.location.href.split('#');
        let menukey = '/main/monitor';
        menukey = url.length > 1 ? url[1] : menukey;

        this.state = {hasNewMsg: false, menukey:menukey};
    }

    componentWillUnmount() {

    }


    render() {

        return (<Layout className="main">
                <div className="header" style={{background:'#fff'}}>
                    <img src="./static/logo.jpeg" style={{height:40}} />
                    <div className="logo" style={{color:'#000'}}>
                        高速公路智能车型识别系统
                    </div>
                    <Menu
                        onSelect={(item,key)=>{
                            this.setState({"menukey":item.key});
                        }}
                        selectedKeys={[this.state.menukey]}
                        style={{flexGrow: 1}}
                        theme="light"
                        mode="horizontal"
                        
                    >
                        <Menu.Item key="/main/test">
                            <Link to='/main/test'>接口测试</Link>
                        </Menu.Item>
                        <Menu.Item key="/main/version">
                            <Link to='/main/version'>版本管理</Link> 
                        </Menu.Item>
                        
                    </Menu>

                    {/*<div className='user'>*/}
                        {/*<div>*/}
                            {/*<Avatar style={{marginRight: 8}}*/}
                                    {/*src={""}/>*/}

                        {/*</div>*/}
                        {/*<div style={{marginRight: 16}}>*/}
                            {/*{sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).employeeDto.name : '袁洋'}*/}
                        {/*</div>*/}
                        {/*<div className='bar'>*/}
                            {/*<Divider type="vertical"/>*/}
                            {/*<a href="javascript:open('/vsb/', '_self').close();"*/}
                               {/*style={{color: "#999", cursor: 'pointer'}}>退出</a>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
                <Layout>
                    <Router>
                        <Switch>
                            <Route path="/main/version" component={Version}/>
                            <Route path="/main/test" component={Test}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}
