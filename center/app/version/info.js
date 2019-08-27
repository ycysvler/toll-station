import React from 'react';
import {Link} from "react-router-dom";
import {Store, Actions} from '../reflux/index';
import {
    Button, Row, Col, Icon, Tooltip,
    Form, Layout, Input, AutoComplete,
    Select, Modal,
    Breadcrumb, Card, message
} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const {Sider, Content} = Layout;

class VersionInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: props.showModal};
        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(next){
        this.setState({visible:next.showModal});
    }

    onStatusChange = (type, data) => {
        switch (type) {
            case "upload":
                this.setState({"fileName": data.data, "uploading":false});
                break;
            case "create":
                this.setState({"visible": false, "uploading":false});
                this.props.refresh();
                break;
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.filename = this.state.fileName;
                values.path = `/root/models/${values.model}`;
                Actions.create(values);
            }
        });
    };

    onUpload(e) {
        // 选择的文件
        let file = e.currentTarget.files[0];
        this.state.videofile = file;
        Actions.upload(file);
        this.setState({uploading: true});
    }

    render() {
        let self = this;

        const {getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
                md: {span: 12},
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };

        return <div>
            <div className={'antd-pro-components-page-header-wrapper-index-content'}>
                <Card bordered={false}>
                    <Modal visible={this.state.visible}
                           title={"添加数据"}
                           onOk={(e) => this.handleSubmit(e)}
                           okButtonProps={{"loading":this.state.uploading,"disabled":this.state.uploading}}
                           onCancel={() => {
                               this.setState({visible: false})
                           }}>
                        <Form
                            ref={"form"}
                            onSubmit={this.handleSubmit} hideRequiredMark style={{marginTop: 8}}>
                            <FormItem {...formItemLayout} label="模型：">
                                {getFieldDecorator('model', {
                                    initialValue: "vehicle",
                                    rules: [
                                        {
                                            required: true,
                                            message: "请上传模型文件",
                                        },
                                    ],
                                })(<Select >
                                    <Option key={"vehicle"}>车型</Option>
                                    <Option key={"cartwheel"}>轴距</Option>
                                </Select>)}
                            </FormItem>

                            <FormItem {...formItemLayout} label="文件：">
                                {getFieldDecorator('file', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请上传模型文件",
                                        },
                                    ],
                                })(<div>
                                    <Button onClick={() => {
                                        this.refs.fileInput.click()
                                    }}>选择文件</Button>
                                    <div><b>{this.state.fileName}</b></div>
                                    <input style={{display: 'none'}} ref={"fileInput"} type={"file"}
                                           onChange={(e) => {
                                               this.onUpload(e);
                                           }}/>

                                </div>)}
                            </FormItem>

                            <FormItem {...formItemLayout} label="版本号：">
                                {getFieldDecorator('version', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "版本号是必填项",
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输版本号！"/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="描述：">
                                {getFieldDecorator('describe', {
                                    rules: [
                                        {
                                            required: false,
                                            message: "描述是必填项",
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入描述地址！"/>
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </Card>
            </div>
        </div>
    }
}

export default Form.create({name: 'versioninfo_form'})(VersionInfo);
