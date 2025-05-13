import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
} from '@ant-design/pro-components';
import { Button, Space, message, Tag, Progress, Modal } from 'antd';
import { PlusOutlined, PoweroffOutlined, PlayCircleOutlined } from '@ant-design/icons';

interface VRDeviceType {
  id: number;
  name: string;
  status: 'running' | 'idle';
  battery: number;
  memory: number;
  storage: number;
  temperature: number;
  lastActiveTime: string;
  model: string;
}

const VRDeviceList: React.FC = () => {
  const [editingDevice, setEditingDevice] = useState<VRDeviceType | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  // 模拟数据
  const mockData: VRDeviceType[] = [
    {
      id: 1,
      name: 'VR-Device-001',
      status: 'running',
      battery: 85,
      memory: 65,
      storage: 45,
      temperature: 37,
      lastActiveTime: '2024-03-20 10:00:00',
      model: 'Quest Pro',
    },
    {
      id: 2,
      name: 'VR-Device-002',
      status: 'idle',
      battery: 92,
      memory: 30,
      storage: 60,
      temperature: 32,
      lastActiveTime: '2024-03-20 11:00:00',
      model: 'Quest 3',
    },
  ];

  const handleDeviceOperation = async (type: 'start' | 'stop', record: VRDeviceType) => {
    const operationText = type === 'start' ? '启动' : '停止';
    try {
      // 这里添加实际的 API 调用
      message.success(`${operationText}设备成功`);
    } catch (error) {
      message.error(`${operationText}设备失败`);
    }
  };

  const handleDelete = (record: VRDeviceType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除设备 ${record.name} 吗？`,
      onOk: async () => {
        try {
          // 这里添加实际的删除 API 调用
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ProColumns<VRDeviceType>[] = [
    {
      title: '设备名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      filters: true,
      valueEnum: {
        'Quest Pro': { text: 'Quest Pro' },
        'Quest 3': { text: 'Quest 3' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      valueEnum: {
        running: { text: '运行中', status: 'Processing' },
        idle: { text: '空闲', status: 'Default' },
      },
    },
    {
      title: '电量',
      dataIndex: 'battery',
      render: (_, record) => (
        <Progress
          percent={record.battery}
          size="small"
          status={record.battery < 20 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: '内存使用',
      dataIndex: 'memory',
      render: (_, record) => (
        <Progress
          percent={record.memory}
          size="small"
          status={record.memory > 80 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: '存储使用',
      dataIndex: 'storage',
      render: (_, record) => (
        <Progress
          percent={record.storage}
          size="small"
          status={record.storage > 90 ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      render: (_, record) => (
        <Tag color={record.temperature > 45 ? 'error' : 'success'}>
          {record.temperature}°C
        </Tag>
      ),
    },
    {
      title: '最后活动时间',
      dataIndex: 'lastActiveTime',
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setEditingDevice(record);
            setCreateModalVisible(true);
          }}
        >
          编辑
        </Button>,
        record.status === 'idle' ? (
          <Button
            key="start"
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => handleDeviceOperation('start', record)}
          >
            启动
          </Button>
        ) : (
          <Button
            key="stop"
            type="link"
            danger
            icon={<PoweroffOutlined />}
            onClick={() => handleDeviceOperation('stop', record)}
          >
            停止
          </Button>
        ),
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<VRDeviceType>
        columns={columns}
        request={async (params, sorter, filter) => {
          // 这里替换为实际的 API 请求
          console.log(params, sorter, filter);
          return {
            data: mockData,
            success: true,
            total: mockData.length,
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
        title={editingDevice ? '编辑设备' : '新增设备'}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        initialValues={editingDevice}
        onFinish={async (values) => {
          console.log(values);
          // 这里添加实际的保存 API 调用
          message.success('提交成功');
          setCreateModalVisible(false);
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="设备名称"
          rules={[{ required: true, message: '请输入设备名称' }]}
        />
        <ProFormSelect
          name="model"
          label="设备型号"
          options={[
            { label: 'Quest Pro', value: 'Quest Pro' },
            { label: 'Quest 3', value: 'Quest 3' },
          ]}
          rules={[{ required: true, message: '请选择设备型号' }]}
        />
        <ProFormSelect
          name="status"
          label="设备状态"
          options={[
            { label: '运行中', value: 'running' },
            { label: '空闲', value: 'idle' },
          ]}
          rules={[{ required: true, message: '请选择设备状态' }]}
        />
        <ProFormDigit
          name="battery"
          label="电量"
          min={0}
          max={100}
          fieldProps={{ suffix: '%' }}
          rules={[{ required: true, message: '请输入电量' }]}
        />
        <ProFormDigit
          name="memory"
          label="内存使用"
          min={0}
          max={100}
          fieldProps={{ suffix: '%' }}
          rules={[{ required: true, message: '请输入内存使用率' }]}
        />
        <ProFormDigit
          name="storage"
          label="存储使用"
          min={0}
          max={100}
          fieldProps={{ suffix: '%' }}
          rules={[{ required: true, message: '请输入存储使用率' }]}
        />
        <ProFormDigit
          name="temperature"
          label="温度"
          min={0}
          max={100}
          fieldProps={{ suffix: '°C' }}
          rules={[{ required: true, message: '请输入温度' }]}
        />
      </ModalForm>
    </>
  );
};

export default VRDeviceList;
