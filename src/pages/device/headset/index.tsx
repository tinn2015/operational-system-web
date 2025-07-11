import { deleteHeadset, getHeadsetList, saveHeadsetList } from '@/services/headset';
import { getServerList } from '@/services/serverCenter';
import { PlayCircleOutlined, PlusOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Col, Divider, message, Popconfirm, Row, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const HeadSetList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>(null);

  const [editingDevice, setEditingDevice] = useState<API.Headset | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  // 获取串流服务列表
  const [streamingServerList, setStreamingServerList] = useState<API.Server[]>([]);
  useEffect(() => {
    getServerList({
      pageSize: 10000,
      pageNum: 1,
      serverType: 2,
    }).then((res) => {
      setStreamingServerList(res.data);
    });
  }, []);

  const handleDeviceOperation = async (type: 'start' | 'stop', record: API.Headset) => {
    const operationText = type === 'start' ? '启动' : '停止';
    console.log('操作设备', type, record);
    try {
      // 这里添加实际的 API 调用
      message.success(`${operationText}设备成功`);
    } catch (error) {
      message.error(`${operationText}设备失败`);
    }
  };

  const handleDelete = async (record: API.Headset) => {
    console.log('删除设备', record);
    await deleteHeadset(record);
    message.success('删除成功');
    tableRef.current?.reload();
  };

  const columns: ProColumns<API.Headset>[] = [
    {
      title: '设备编号',
      dataIndex: 'headsetNo',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 200,
    },
    {
      title: '绑定服务器IP',
      dataIndex: 'serverIp',
      ellipsis: true,
      align: 'center',
      width: 200,
      // valueEnum: () => {
      //   const values = {};
      //   streamingServerList.forEach((item) => {
      //     values[item.id] = { text: item.serverIp };
      //   });
      //   return values;
      // },
    },
    // {
    //   title: '设备类型',
    //   dataIndex: 'headsetType',
    //   valueEnum: {
    //     1: { text: '头显' },
    //     2: { text: '一体机' },
    //   },
    //   align: 'center',
    //   width: 80,
    // },
    {
      title: '状态',
      dataIndex: 'status',
      // filters: true,
      valueEnum: {
        1: { text: '运行中', status: 'Processing' },
        0: { text: '空闲', status: 'Default' },
        2: { text: '未知', status: 'Default' },
      },
      align: 'center',
      width: 200,
    },
    {
      title: '网络类型',
      dataIndex: 'networkType',
      width: 200,
      // filters: true,
      valueEnum: {
        1: { text: 'wifi' },
        2: { text: '5g' },
      },
      align: 'center',
    },
    {
      title: '剩余电量',
      dataIndex: 'remainElectricity',
      align: 'center',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.remainElectricity > 20 ? 'success' : 'error'}>
          {record.remainElectricity}%
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      ellipsis: true,
      align: 'center',
      render: (_, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setEditingDevice(record);
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          {record.status !== 2 &&
            (record.status !== 1 ? (
              <Button
                key="start"
                type="link"
                icon={<PlayCircleOutlined />}
                onClick={() => handleDeviceOperation('start', record)}
              >
                启动
              </Button>
            ) : (
              <Popconfirm
                title="确认停止"
                description="确定要停止该设备吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={() => handleDeviceOperation('stop', record)}
              >
                <Button key="stop" type="link" danger icon={<PoweroffOutlined />}>
                  停止
                </Button>
              </Popconfirm>
            ))}
          <Popconfirm
            title="确认删除"
            description="确定要删除该设备吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDelete(record)}
          >
            <Button key="delete" type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<API.Headset>
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params, sorter, filter) => {
          // 这里替换为实际的 API 请求
          console.log('头显查询', params, sorter, filter);
          const headsetList = await getHeadsetList({
            pageSize: 1000,
            pageNum: 1,
            ...params,
          });
          console.log('headsetList', headsetList);
          return {
            data: headsetList.data,
            success: true,
            total: headsetList.total,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          locale: {
            items_per_page: '条/页',
            jump_to: '跳至',
            jump_to_confirm: '确定',
            page: '页',
          },
        }}
        search={{
          labelWidth: 'auto',
          resetText: '重置',
          searchText: '查询',
          collapsed: false,
          collapseRender: false,
        }}
        options={{
          search: false,
          fullScreen: false,
          reload: true,
          setting: false,
          density: false,
        }}
        dateFormatter="string"
        headerTitle="VR头显设备管理"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setEditingDevice(undefined);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增设备
          </Button>,
        ]}
      />

      <ModalForm
        key={editingDevice?.id}
        title={editingDevice ? '编辑头显设备' : '新增头显设备'}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (!visible) {
            setEditingDevice(undefined);
            formRef.current?.resetFields();
          }
        }}
        initialValues={editingDevice}
        formRef={formRef}
        onFinish={async (values) => {
          console.log('编辑或者新增头显', values, editingDevice);
          const newValues = editingDevice ? { ...values, id: editingDevice.id } : values;
          await saveHeadsetList(newValues);
          // 这里添加实际的保存 API 调用
          message.success('提交成功');
          tableRef.current?.reload();
          setCreateModalVisible(false);
          return true;
        }}
      >
        <Row gutter={20}>
          <Col span={12}>
            <ProFormText
              name="headsetNo"
              label="头显编码"
              placeholder="请输入头显编码"
              rules={[{ required: true, message: '请输入头显编码' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="headsetIp"
              label="头显IP"
              placeholder="请输入头显IP"
              rules={[
                { required: true, message: '请输入头显IP' },
                {
                  pattern:
                    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: '请输入正确的IP地址格式，如：192.168.1.1',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={8}>
            {/* <ProFormText name="serverIp" label="绑定串流服务" placeholder="请绑定串流服务" /> */}
            <ProFormSelect
              name="serverIp"
              label="绑定串流服务"
              placeholder="请绑定串流服务"
              rules={[{ required: true, message: '请选择串流服务' }]}
              options={streamingServerList.map((server) => ({
                label: server.serverIp,
                value: server.id,
              }))}
            />
          </Col>
          <Col span={8}>
            <ProFormSelect
              name="networkType"
              label="网络类型"
              options={[
                { label: 'wifi', value: 1 },
                { label: '5g', value: 2 },
              ]}
              rules={[{ required: true, message: '请选择网络类型' }]}
            />
          </Col>
          <Col span={8}>
            <ProFormSelect
              name="headsetType"
              label="头显类型"
              options={[
                { label: '头显', value: 1 },
                { label: '一体机', value: 2 },
              ]}
              rules={[{ required: true, message: '请选头显类型' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default HeadSetList;
