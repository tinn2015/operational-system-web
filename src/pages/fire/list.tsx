import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useRef } from 'react';

// 告警数据类型定义
interface FireAlarm {
  id: string;
  location: string; // 告警场地
  alarmTime: string; // 告警时间
  alarmType: string; // 告警类型
  alarmCount: number; // 告警次数
  status: string; // 告警状态
  description: string; // 告警描述
  operator: string; // 处理人员
  handleTime?: string; // 处理时间
}

// 模拟数据
const mockData: FireAlarm[] = [
  {
    id: '1',
    location: 'A区-1号厅',
    alarmTime: '2024-01-15 14:30:25',
    alarmType: '烟雾报警',
    alarmCount: 3,
    status: '已处理',
    description: '检测到烟雾浓度超标',
    operator: '张三',
    handleTime: '2024-01-15 14:35:10',
  },
  {
    id: '2',
    location: 'B区-2号厅',
    alarmTime: '2024-01-15 15:20:18',
    alarmType: '温度报警',
    alarmCount: 1,
    status: '处理中',
    description: '温度传感器异常',
    operator: '李四',
  },
  {
    id: '3',
    location: 'C区-3号厅',
    alarmTime: '2024-01-15 16:45:33',
    alarmType: '火灾报警',
    alarmCount: 5,
    status: '已处理',
    description: '火灾探测器触发',
    operator: '王五',
    handleTime: '2024-01-15 16:50:15',
  },
  {
    id: '4',
    location: 'D区-4号厅',
    alarmTime: '2024-01-15 17:10:42',
    alarmType: '烟雾报警',
    alarmCount: 2,
    status: '待处理',
    description: '烟雾浓度轻微超标',
    operator: '',
  },
  {
    id: '5',
    location: 'E区-5号厅',
    alarmTime: '2024-01-15 18:25:55',
    alarmType: '温度报警',
    alarmCount: 1,
    status: '已处理',
    description: '空调系统故障导致温度异常',
    operator: '赵六',
    handleTime: '2024-01-15 18:30:20',
  },
];

const FireAlarmList: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const columns: ProColumns<FireAlarm>[] = [
    {
      title: '告警场地',
      dataIndex: 'location',
      width: 150,
      align: 'center',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: 180,
      align: 'center',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '告警类型',
      dataIndex: 'alarmType',
      width: 120,
      align: 'center',
      valueEnum: {
        烟雾报警: { text: '烟雾报警', status: 'Warning' },
        温度报警: { text: '温度报警', status: 'Error' },
        火灾报警: { text: '火灾报警', status: 'Error' },
        设备故障: { text: '设备故障', status: 'Default' },
      },
    },
    {
      title: '告警次数',
      dataIndex: 'alarmCount',
      width: 100,
      align: 'center',
      sorter: true,
      render: (_, record) => (
        <Tag color={record.alarmCount > 3 ? 'red' : record.alarmCount > 1 ? 'orange' : 'green'}>
          {record.alarmCount} 次
        </Tag>
      ),
    },
    {
      title: '告警状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      valueEnum: {
        待处理: { text: '待处理', status: 'Error' },
        处理中: { text: '处理中', status: 'Processing' },
        已处理: { text: '已处理', status: 'Success' },
        已忽略: { text: '已忽略', status: 'Default' },
      },
    },
    {
      title: '告警描述',
      dataIndex: 'description',
      width: 200,
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '处理人员',
      dataIndex: 'operator',
      width: 120,
      align: 'center',
      search: false,
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
      width: 180,
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
  ];

  return (
    <ProTable<FireAlarm>
      actionRef={tableRef}
      columns={columns}
      scroll={{ x: 'max-content' }}
      request={async (params) => {
        // 模拟API请求
        const { current = 1, pageSize = 10, ...searchParams } = params;

        // 模拟搜索过滤
        let filteredData = [...mockData];

        if (searchParams.location) {
          filteredData = filteredData.filter((item) =>
            item.location.includes(searchParams.location),
          );
        }

        if (searchParams.alarmType) {
          filteredData = filteredData.filter((item) => item.alarmType === searchParams.alarmType);
        }

        if (searchParams.status) {
          filteredData = filteredData.filter((item) => item.status === searchParams.status);
        }

        // 模拟分页
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          success: true,
          total: filteredData.length,
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
      headerTitle="消防告警列表"
      // 不显示工具栏，因为不支持新增和编辑
      toolBarRender={() => []}
    />
  );
};

export default FireAlarmList;
