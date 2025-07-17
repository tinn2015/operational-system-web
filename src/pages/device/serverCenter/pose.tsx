import AutoRefreshControls from '@/components/AutoRefreshControls';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import { getServerList, operateServer } from '@/services/serverCenter';
import { SERVER_OPERATION } from '@/utils/constant';
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Space } from 'antd';
import React, { useRef } from 'react';

const Pose: React.FC = () => {
  const tableRef = useRef<ActionType>();

  // 使用自定义Hook管理自动刷新
  const { autoRefresh, setAutoRefresh, refreshInterval, setRefreshInterval } = useAutoRefresh(
    () => {
      tableRef.current?.reload();
    },
  );

  const handleDeviceOperation = async (type: number, record: API.Server) => {
    const operationText =
      type === SERVER_OPERATION.START ? '启动' : type === SERVER_OPERATION.STOP ? '停止' : '重启';

    await operateServer({ id: record.id, operateType: type });

    message.success(`设备${operationText}成功`);
    tableRef.current?.reload();
  };

  const columns: ProColumns<API.Server>[] = [
    {
      title: '服务器IP',
      dataIndex: 'serverIp',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '服务器类型',
      dataIndex: 'serverType',
      search: false,
      valueEnum: {
        1: { text: '串流服务器' },
        2: { text: '游戏client' },
        3: { text: '游戏server' },
        4: { text: '位姿总服务器' },
        5: { text: '位姿子服务器' },
      },
      align: 'center',
      width: 150,
    },
    {
      title: '服务状态',
      dataIndex: 'serverStatus',
      valueEnum: {
        0: { text: '停止', color: 'red' },
        1: { text: '运行中', color: 'green' },
        2: { text: '未知', color: 'orange' },
      },
      align: 'center',
      width: 120,
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
      width: 120,
    },
    {
      title: '启动时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 180,
      search: false,
    },
    {
      title: '最后同步时间',
      dataIndex: 'lastSyncTime',
      valueType: 'dateTime',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 180,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      ellipsis: true,
      align: 'center',
      render: (_, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          <Button
            key="start"
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => handleDeviceOperation(SERVER_OPERATION.START, record)}
          >
            启动
          </Button>
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
        </Space>
      ),
    },
  ];

  // 使用自定义组件作为刷新控制
  const refreshControls = (
    <AutoRefreshControls
      autoRefresh={autoRefresh}
      setAutoRefresh={setAutoRefresh}
      refreshInterval={refreshInterval}
      setRefreshInterval={setRefreshInterval}
    />
  );

  return (
    <>
      <ProTable<API.Server>
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const deviceList = await getServerList({
            pageSize: params.pageSize,
            pageNum: params.current,
            serverType: 5,
          });
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
        headerTitle="位姿子服务器"
        options={{
          setting: true,
          reload: true,
        }}
        toolbar={{
          actions: [refreshControls],
        }}
      />
    </>
  );
};

export default Pose;
