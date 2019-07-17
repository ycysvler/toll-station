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
        this.state = {visible: props.showModal};
        this.unsubscribe = Store.listen(this.onStatusChange.bind(this));

        // 获取当前序列号
        Actions.serial();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(next) {
        this.setState({visible: next.showModal});
    }

    onStatusChange = (type, data) => {
        switch (type) {
            case "checkPwd":
                console.log('checkPwd', data);
                if(data.code === 403){
                    message.warning('注册码不正确！');
                    this.setState({verify:false});
                }
                if(data.code === 200){
                    this.setState({verify:true});
                }

                break;
            case "serial":
                this.setState({'serial': data});
                break;
            case "register":
                message.success('注册成功！');
                break;
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {

            if (!err) {
                console.log('Received values of form: ', values);
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

        return <div>
            <div className={'antd-pro-components-page-header-wrapper-index-content'}>
                <Form {...formItemLayout} ref={"form"}
                      onSubmit={this.handleSubmit} hideRequiredMark
                      style={{marginTop: 8, width: 800, margin: '0 auto'}}>
                    <FormItem {...formItemLayout} label="序列号">
                        {this.state.serial}
                    </FormItem>

                    <FormItem {...formItemLayout} label="注册码">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: "注册码是必填项",
                                },
                            ],
                        })(
                            <Input onChange={
                                (e)=>{
                                    let value = e.currentTarget.value;
                                    if(value.length > 30)
                                        Actions.checkPwd(e.currentTarget.value);
                                }
                            } placeholder="请输入注册码！"/>
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary"
                                disabled={this.state.verify?false:true}
                                htmlType="submit">
                            注册
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    }
}

export default Form.create({name: 'register_form'})(Register);
