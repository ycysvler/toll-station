import React from 'react';
import {Link} from "react-router-dom";
import {Store, Actions} from '../reflux/station';
import {
    Button, Row, Col, Icon, Tooltip,
    Form, Layout, Input, AutoComplete,
    Select, Modal,
    Breadcrumb, Card, message
} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const {Sider, Content} = Layout;

class StationInfo extends React.Component {
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
            case "create":
                this.setState({"visible": false});
                this.props.complete();
                break;
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {

            if (!err) {
                console.log('Received values of form: ', values);
                Actions.create(values);
            }
        });
    };

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
                            <FormItem {...formItemLayout} label="IP：">
                                {getFieldDecorator('ip', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输IP!",
                                        },
                                    ],
                                })(<Input placeholder="请输IP！"/>)}
                            </FormItem>

                            <FormItem {...formItemLayout} label="名称">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "名称是必填项",
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输名称！"/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="描述">
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

export default Form.create({name: 'StationInfo_form'})(StationInfo);
