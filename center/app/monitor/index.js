/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import { Layout,Tag, Select ,Switch,Icon,Table ,Input} from 'antd';
import {Actions, Store} from '../reflux/station';
const { Search } = Input;
const { Option } = Select;
export default class Monitor extends React.Component {
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
            case "monitor":
                this.setState({list:data.data});
                break;
            case "remove":
            case "status":
                this.refresh();
                break;
        }
    }

    refresh=()=>{
        Actions.monitor(this.state.ip,this.state.v,this.state.c,this.state.b, this.state.page);
    };

    columns = [{
        title: '地址',
        width:250,
        dataIndex: 'ip',
        key: 'ip',
    },{
        title:'车型接口版本',
        width:130,
        dataIndex:'vehicle_version',
        key:'vehicle_version'
    },{
        title: '车型接口',
        width:130,
        dataIndex: 'vehicle_status',
        key: 'vehicle_status',
        render:(text, record)=>{
            switch(record.vehicle_status){
                case 0:return <Tag color="#2db7f5">新增</Tag>;
                case 1:return <Tag color="#87d068">正常</Tag>;
                case -1:return <Tag color="#f50">异常</Tag>;
            }
        }
    },{
        title:'轴距接口版本',
        width:130,
        dataIndex:'cartwheel_version',
        key:'cartwheel_version'
    },
        {
        title: '轴距接口',
        width:130,
        dataIndex: 'cartwheel_status',
        key: 'cartwheel_status',
        render:(text, record)=>{
            switch(record.cartwheel_status){
                case 0:return <Tag color="#2db7f5">新增</Tag>;
                case 1:return <Tag color="#87d068">正常</Tag>;
                case -1:return <Tag color="#f50">异常</Tag>;
            }
        }
    },{
        title: '模糊接口',
        width:130,
        dataIndex: 'blur_status',
        key: 'blur_status',
        render:(text, record)=>{
            switch(record.blur_status){
                case 0:return <Tag color="#2db7f5">新增</Tag>;
                case 1:return <Tag color="#87d068">正常</Tag>;
                case -1:return <Tag color="#f50">异常</Tag>;
            }
        }
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }];

    render() {
        return (
            <Layout>
                <Layout style={{borderLeft:'solid 1px #e8e8e8',padding:16}}>
                    <div style={{paddingBottom:16}}>
                        <Search
                            placeholder="IP地址"
                            onSearch={value => {console.log(value);this.state.ip=value;this.refresh();}}
                            style={{ width: 240,marginLeft:5,marginRight:5 }}
                        />

                        <Select defaultValue="" style={{ width: 120, marginLeft:135, marginRight:5 }}
                                onChange={(value)=>{ console.log(value); this.state.v=value;this.refresh();}}
                        >
                            <Option value="">全部</Option>
                            <Option value="0">新增</Option>
                            <Option value="1">正常</Option>
                            <Option value="-1">异常</Option>
                        </Select>

                        <Select defaultValue="" style={{ width: 120, marginLeft:135, marginRight:5 }}
                                onChange={(value)=>{ console.log(value); this.state.c=value;this.refresh();}}
                        >
                            <Option value="">全部</Option>
                            <Option value="0">新增</Option>
                            <Option value="1">正常</Option>
                            <Option value="-1">异常</Option>
                        </Select>

                        <Select defaultValue="" style={{ width: 120, marginLeft:5, marginRight:5 }}
                                onChange={(value)=>{ console.log(value); this.state.b=value;this.refresh();}}
                        >
                            <Option value="">全部</Option>
                            <Option value="0">新增</Option>
                            <Option value="1">正常</Option>
                            <Option value="-1">异常</Option>
                        </Select>
                        </div>

                    <Table bordered rowKey="_id" dataSource={this.state.list} columns={this.columns} />

                </Layout>
            </Layout>
        );
    }
}