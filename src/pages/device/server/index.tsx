import AutoRefreshControls from '@/components/AutoRefreshControls';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import {
  deleteDevice,
  getDeviceList,
  getDeviceStatus,
  rebootDevice,
  saveDevice,
} from '@/services/device';
import { SERVER_OPERATION } from '@/utils/constant';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Empty,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
} from 'antd';
import React, { useRef, useState } from 'react';

const HeadSetList: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const [editingDevice, setEditingDevice] = useState<API.Device | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [statusModalVisible, setStatusModalVisible] = useState<boolean>(false);
  const [deviceStatusData, setDeviceStatusData] = useState<Record<string, any>[]>([]);
  const [currentDeviceName, setCurrentDeviceName] = useState<string>('');
  const formRef = useRef<ProFormInstance>();

  // 使用自定义Hook管理自动刷新
  const { autoRefresh, setAutoRefresh, refreshInterval, setRefreshInterval } = useAutoRefresh(
    () => {
      tableRef.current?.reload();
    },
  );

  const handleDeviceOperation = async (type: number, record: API.Device) => {
    // const operationText =
    //   type === SERVER_OPERATION.START ? '启动' : type === SERVER_OPERATION.STOP ? '停止' : '重启';
    console.log('操作设备', type, record);

    try {
      // 这里添加实际的 API 调用
      const res = await rebootDevice({
        id: record.id,
      });
      if (res) {
        message.success(`设备重启成功`);
      }
    } catch (error) {
      message.error(`设备重启失败`);
    }
  };

  const handleDelete = async (record: API.Device) => {
    console.log('删除设备', record);
    const res = await deleteDevice(record);
    if (res) {
      message.success('删除成功');
      tableRef.current?.reload();
    }
  };

  const handleViewStatus = async (record: API.Device) => {
    try {
      const response = await getDeviceStatus(record.id);
      setDeviceStatusData(response || []);
      setCurrentDeviceName(record.serverIp || '未命名设备');
      setStatusModalVisible(true);
    } catch (error) {
      message.error('获取设备状态失败');
    }
  };

  // 使用自定义组件作为刷新控制
  const refreshControls = (
    <AutoRefreshControls
      autoRefresh={autoRefresh}
      setAutoRefresh={setAutoRefresh}
      refreshInterval={refreshInterval}
      setRefreshInterval={setRefreshInterval}
    />
  );

  const columns: ProColumns<API.Device>[] = [
    {
      title: '服务器名称',
      dataIndex: 'deviceName',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '服务器Ip',
      dataIndex: 'serverIp',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '服务器类型',
      dataIndex: 'serverType',
      valueEnum: {
        0: { text: '非位姿服务器' },
        // 1: { text: '串流服务器' },
        // 2: { text: '游戏client' },
        // 3: { text: '游戏server' },
        4: { text: '位姿总服务器' },
        5: { text: '位姿子服务器' },
      },
      align: 'center',
      width: 150,
    },
    {
      title: '服务器状态',
      dataIndex: 'onlineStatus',
      valueEnum: {
        0: { text: '停止', color: 'red' },
        1: { text: '运行中', color: 'green' },
        2: { text: '未知', color: 'orange' },
      },
      align: 'center',
      width: 100,
    },
    {
      title: 'agent状态',
      dataIndex: 'agentStatus',
      valueEnum: {
        0: { text: '离线', color: 'red' },
        1: { text: '在线', color: 'green' },
        2: { text: '未知', color: 'orange' },
      },
      align: 'center',
      width: 100,
    },
    {
      title: 'agent启动时间',
      dataIndex: 'agentTime',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
      ellipsis: true,
      align: 'center',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              console.log('编辑设备', record);
              formRef.current?.setFieldsValue(record);
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
          {record.agentStatus === 1 && (
            <>
              <Button key="start" type="link" onClick={() => handleViewStatus(record)}>
                查看状态
              </Button>
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
            </>
          )}
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
        scroll={{ x: 'max-content' }}
        request={async (params, sorter, filter) => {
          // 这里替换为实际的 API 请求
          console.log('服务器查询', params, sorter, filter);
          const deviceList = await getDeviceList({
            pageSize: params.pageSize,
            pageNum: params.current,
            ...params,
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
        options={{
          search: false,
          fullScreen: false,
          reload: true,
          setting: false,
          density: true,
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
          <Space key="refreshControls">{refreshControls}</Space>,
        ]}
      />

      <ModalForm
        title={editingDevice ? '编辑服务器设备' : '新增服务器设备'}
        open={createModalVisible}
        formRef={formRef}
        initialValues={editingDevice}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (!visible) {
            setEditingDevice(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={async (values) => {
          console.log('编辑或者新增服务器', values, editingDevice);
          const newValues = editingDevice ? { ...values, id: editingDevice.id } : values;
          const res = await saveDevice(newValues);
          // 这里添加实际的保存 API 调用
          if (res) {
            message.success('提交成功');
            tableRef.current?.reload();
          }
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
                { label: '非位姿服务器', value: 0 },
                // { label: '串流服务器', value: 1 },
                // { label: '游戏client', value: 2 },
                // { label: '游戏server', value: 3 },
                { label: '位姿总服务器', value: 4 },
                { label: '位姿子服务器', value: 5 },
              ]}
              rules={[{ required: true, message: '请选服务器类型' }]}
            />
          </Col>
        </Row>
      </ModalForm>

      <Modal
        title={`${currentDeviceName} - 服务器状态信息`}
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setStatusModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {deviceStatusData.length > 0 ? (
          <Descriptions bordered column={1}>
            {deviceStatusData.map((item, index) => (
              <Descriptions.Item key={index} label={item.item}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{item.itemValue}</pre>
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <Empty description="暂无状态信息" />
        )}
      </Modal>
    </>
  );
};

export default HeadSetList;
