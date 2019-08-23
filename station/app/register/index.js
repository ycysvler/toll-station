import React from 'react';
import {Link} from "react-router-dom";
import {Store, Actions} from '../reflux/index';
import {
    Button, Row, Col, Icon, Tooltip,
    Form, Layout, Input, AutoComplete,
    Select,
    Breadcrumb, message
} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const {Sider, Content} = Layout;

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {verify:Store.verify, visible: props.showModal};
        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(next) {
        this.setState({visible: next.showModal});
    }

    onStatusChange = (type, data) => {
        switch (type) {
            case "verify":
                if(data.code === 200){
                    this.setState({verify:true})
                }
                break;
            case "register":
                if(data.code === 200)
                    message.success('注册成功！');
                else
                    message.error(data.message);
                break;
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Actions.register(values);
            }
        });
    };

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    };

    render() {
        let self = this;

        const {getFieldDecorator, getFieldValue, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };


        return <div style={{ padding: 16}}>
            <div className={'antd-pro-components-page-header-wrapper-index-content'}>
                <Form {...formItemLayout} ref={"form"}
                      onSubmit={this.handleSubmit} hideRequiredMark
                      style={{marginTop: 8, width: 800, margin: '0 auto'}}>

                    <FormItem {...formItemLayout} label="IP：">
                        {getFieldDecorator('ip', {
                            rules: [
                                {
                                    required: true,
                                    message: "中心IP是必填项",
                                },
                            ],
                        })(<Input placeholder="请输中心IP！"/>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="本站名称">
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: "本站名称是必填项",
                                },
                            ],
                        })(
                            <Input placeholder="请输本站名称！"/>
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



                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            注册
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    }
}

export default Form.create({name: 'register_form'})(Register);
