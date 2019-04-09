/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Menu, Divider, Icon, Button,Tabs, Table} from 'antd';
import {TestActions, TestStore} from '../reflux/test';
const TabPane = Tabs.TabPane;
const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

export default class Test extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = TestStore.listen(this.onStatusChange.bind(this));
        this.state = {list: []};

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {

    }

    onStatusChange(action, data) {
        switch (action) {
            case "blur":
                console.log('blur', data);
                this.setState({list: data.data});
                break;
            case "download":
            case "online":
            case "remove":
            case "status":
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
                                         Actions.online(
                                             record.model, record.version, record.filename
                                         )
                                     }}
                >启动</a>}
                    {record.current ? null : <Divider type="vertical"/>}
                    {record.exist ? null:<a href="javascript:;"
                       onClick={() => {
                           Actions.download(record.filename)
                       }}
                    >下载</a>}
            </span>
            }
        }];

    callback(key) {
        console.log(key);
    }

    onBlurUpload(e) {
        // 选择的文件
        let file = e.currentTarget.files[0];
        TestActions.blur(file);
        this.setState({uploading: true});
    }
    onCartwheelUpload(e) {
        // 选择的文件
        let file = e.currentTarget.files[0];
        TestActions.blur(file);
        this.setState({uploading: true});
    }
    onVehicleUpload(e) {
        // 选择的文件
        let file = e.currentTarget.files[0];
        TestActions.blur(file);
        this.setState({uploading: true});
    }
    render() {
        return (
            <Layout>

                <Layout style={{borderLeft: 'solid 1px #e8e8e8', padding: 16}}>

                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="模糊测试" key="1">
                            <div>
                                <Button onClick={() => {
                                    this.refs.fileBlurInput.click()
                                }}>选择文件</Button>
                                <div><b>{this.state.fileName}</b></div>
                                <input style={{display: 'none'}} ref={"fileBlurInput"} type={"file"}
                                       onChange={(e) => {
                                           this.onBlurUpload(e);
                                       }}/>
                            </div>

                        </TabPane>
                        <TabPane tab="车轮数量测试" key="2">
                            <div>
                                <Button onClick={() => {
                                    this.refs.fileCartwheelInput.click()
                                }}>选择文件</Button>
                                <div><b>{this.state.fileName}</b></div>
                                <input style={{display: 'none'}} ref={"fileCartwheelInput"} type={"file"}
                                       onChange={(e) => {
                                           this.onCartwheelUpload(e);
                                       }}/>
                            </div>

                        </TabPane>
                        <TabPane tab="车型测试" key="3"><div>
                            <Button onClick={() => {
                                this.refs.fileVehicleInput.click()
                            }}>选择文件</Button>
                            <div><b>{this.state.fileName}</b></div>
                            <input style={{display: 'none'}} ref={"fileVehicleInput"} type={"file"}
                                   onChange={(e) => {
                                       this.onVehicleUpload(e);
                                   }}/>
                        </div></TabPane>
                    </Tabs>

                </Layout>
            </Layout>
        );
    }
}