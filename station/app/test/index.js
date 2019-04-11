/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Menu, Divider, Icon, Button,Tabs, Card} from 'antd';
import {TestActions, TestStore} from '../reflux/test';
const TabPane = Tabs.TabPane;
const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;
import './index.css';

export default class Test extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = TestStore.listen(this.onStatusChange.bind(this));
        this.state = {list: [], blur:"", vehicle:"", cartwheel:""};

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
                this.setState({'blur': JSON.stringify(data)});
                break;
            case "vehicle":
                console.log('vehicle', data);
                this.setState({'vehicle': JSON.stringify(data)});
                break;
            case "cartwheel":
                console.log('cartwheel', data);
                this.setState({'cartwheel': JSON.stringify(data)});
                break;
            case "remove":
            case "status":
                break;
        }
    }



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
        TestActions.cartwheel(file);
        this.setState({uploading: true});
    }
    onVehicleUpload(e) {
        // 选择的文件
        let file = e.currentTarget.files[0];
        TestActions.vehicle(file);
        this.setState({uploading: true});
    }

    syntaxHighlight(json) {
             if (typeof json != 'string') {
                     json = JSON.stringify(json, undefined, 2);
                 }
             json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
             let result = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                     function(match) {
                         var cls = 'number';
                         if (/^"/.test(match)) {
                                 if (/:$/.test(match)) {
                                         cls = 'key';
                                     } else {
                                         cls = 'string';
                                     }
                             } else if (/true|false/.test(match)) {
                                 cls = 'boolean';
                             } else if (/null/.test(match)) {
                                 cls = 'null';
                             }
                         return '<span class="' + cls + '">' + match + '</span>';
                     }
             );
             return result;
         }


    render() {
        console.log(this.syntaxHighlight(this.state.vehicle));
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

                                <div>
                                    <br/>
                                    <Card title={"result"}>
                                        <pre dangerouslySetInnerHTML={{__html:this.syntaxHighlight(this.state.blur)}}></pre>
                                    </Card>
                                </div>
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

                                <div>
                                    <br/>
                                    <Card title={"result"}>

                                        <pre dangerouslySetInnerHTML={{__html:this.syntaxHighlight(this.state.cartwheel)}}></pre>
                                    </Card>
                                </div>
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
                            <div>
                                <br/>
                                <Card title={"result"}>
                                    <pre dangerouslySetInnerHTML={{__html:this.syntaxHighlight(this.state.vehicle)}}></pre>
                                </Card>
                            </div>
                        </div></TabPane>
                    </Tabs>

                </Layout>
            </Layout>
        );
    }
}