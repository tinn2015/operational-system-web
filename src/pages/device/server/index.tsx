import { deleteDevice, getDeviceList, rebootDevice, saveDevice } from '@/services/device';
import { SERVER_OPERATION } from '@/utils/constant';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Col, Divider, message, Popconfirm, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';

const HeadSetList: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const [editingDevice, setEditingDevice] = useState<API.Device | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const handleDeviceOperation = async (type: number, record: API.Device) => {
    // const operationText =
    //   type === SERVER_OPERATION.START ? '启动' : type === SERVER_OPERATION.STOP ? '停止' : '重启';
    console.log('操作设备', type, record);

    try {
      // 这里添加实际的 API 调用
      await rebootDevice({
        id: record.id,
      });
      message.success(`设备重启成功`);
    } catch (error) {
      message.error(`设备重启失败`);
    }
  };

  const handleDelete = async (record: API.Device) => {
    console.log('删除设备', record);
    await deleteDevice(record);
    message.success('删除成功');
    tableRef.current?.reload();
  };

  const columns: ProColumns<API.Device>[] = [
    {
      title: '服务器Ip',
      dataIndex: 'serverIp',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 200,
    },
    {
      title: '服务器类型',
      dataIndex: 'serverType',
      valueEnum: {
        1: { text: '串流服务器' },
        2: { text: '游戏client' },
        3: { text: '游戏server' },
        4: { text: '位姿总服务器' },
        5: { text: '位姿子服务器' },
      },
      align: 'center',
    },
    {
      title: '服务器状态',
      dataIndex: 'agentStatus',
      valueEnum: {
        0: { text: '停止', color: 'red' },
        1: { text: '运行中', color: 'green' },
        2: { text: '未知', color: 'orange' },
      },
      align: 'center',
      width: 200,
    },
    {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      valueEnum: {
        0: { text: '离线', color: 'red' },
        1: { text: '在线', color: 'green' },
        2: { text: '未知', color: 'orange' },
      },
      align: 'center',
      width: 200,
    },
    {
      title: 'agent启动时间',
      dataIndex: 'agentTime',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 200,
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
          {/* {record.serverStatus === 0 || record.serverStatus === 2 ? (
            <Button
              key="start"
              type="link"
              icon={<PlayCircleOutlined />}
              onClick={() => handleDeviceOperation(SERVER_OPERATION.START, record)}
            >
              启动
            </Button>
          ) : (
            <Popconfirm
              title="确认停止"
              description="确定要停止该设备吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDeviceOperation(SERVER_OPERATION.STOP, record)}
            >
              <Button key="stop" type="link" danger icon={<PoweroffOutlined />}>
                停止
              </Button>
            </Popconfirm>
          )} */}
          <Popconfirm
            title="确认重启"
            description="确定要重启该设备吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDeviceOperation(SERVER_OPERATION.REBOOT, record)}
          >
            <Button key="restart" variant="text" color="purple">
              重启
            </Button>
          </Popconfirm>
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
      <ProTable<API.Device>
        actionRef={tableRef}
        columns={columns}
        request={async (params, sorter, filter) => {
          // 这里替换为实际的 API 请求
          console.log('服务器查询', params, sorter, filter);
          const deviceList = await getDeviceList({
            pageSize: 100,
            pageNum: 1,
            // serverType: 1,
          });
          console.log('deviceList', deviceList);
          return {
            data: deviceList.data,
            success: true,
            total: deviceList.total,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        headerTitle="服务器设备管理"
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
        title={editingDevice ? '编辑服务器设备' : '新增服务器设备'}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        initialValues={editingDevice}
        onFinish={async (values) => {
          console.log('编辑或者新增服务器', values, editingDevice);
          const newValues = editingDevice ? { ...values, id: editingDevice.id } : values;
          await saveDevice(newValues);
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
              name="serverIp"
              label="服务器IP"
              placeholder="请输入服务器IP"
              rules={[{ required: true, message: '请输入服务器IP' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="serverType"
              label="服务器类型"
              options={[
                { label: '串流服务器', value: 1 },
                { label: '游戏client', value: 2 },
                { label: '游戏server', value: 3 },
                { label: '位姿总服务器', value: 4 },
                { label: '位姿子服务器', value: 5 },
              ]}
              rules={[{ required: true, message: '请选服务器类型' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default HeadSetList;
