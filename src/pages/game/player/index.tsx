/**
 * 玩家信息表
 */
import { getPlayerList } from '@/services/player';
import { QrcodeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Image, message, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

// 玩家类型定义
interface Player {
  id: string;
  nickName: string;
  teamCode: string;
  sexCode: string;
  height: number;
  age: string;
  relatedCoupons: string;
  ticketUser: string;
  photoUser: string;
  gameStatus: string;
  headsetIp: string;
  networkType: string;
  gameClient: string;
  gameServer: string;
  beginTime: string;
  endTime: string;
  lastStuck: string;
  gamePictureList: string[];
}

const PlayerList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const columns: ProColumns<Player>[] = [
    {
      title: '玩家昵称',
      dataIndex: 'nickName',
      copyable: true,
      ellipsis: true,
      width: 150,
      align: 'center',
    },
    {
      title: '队伍批次',
      dataIndex: 'teamCode',
      width: 120,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sexCode',
      width: 80,
      align: 'center',
      search: false,
      valueEnum: {
        1: { text: '男', status: 'Processing' },
        2: { text: '女', status: 'Success' },
        3: { text: '未知', status: 'Default' },
      },
    },
    {
      title: '身高(cm)',
      dataIndex: 'height',
      width: 80,
      align: 'center',
      search: false,
    },
    {
      title: '年龄段',
      dataIndex: 'age',
      width: 100,
      align: 'center',
      search: false,
      valueEnum: {
        1: { text: '成人', status: 'Processing' },
        2: { text: '儿童', status: 'Warning' },
      },
    },
    {
      title: '关联卡券',
      dataIndex: 'relatedCoupons',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '购票用户',
      dataIndex: 'ticketUser',
      width: 100,
      align: 'center',
    },
    {
      title: '照片领取用户',
      dataIndex: 'photoUser',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '游戏状态',
      dataIndex: 'gameStatus',
      width: 120,
      align: 'center',
      valueEnum: {
        0: { text: '组队中', status: 'processing' },
        1: { text: '游戏中', status: 'success' },
        2: { text: '结束', status: 'error' },
        3: { text: '即将结束', status: 'warning' },
      },
    },
    {
      title: '头显IP',
      dataIndex: 'headsetIp',
      width: 150,
      align: 'center',
      search: false,
    },
    {
      title: '网络类型',
      dataIndex: 'networkType',
      width: 100,
      align: 'center',
      search: false,
      valueEnum: {
        1: { text: 'WiFi', status: 'Success' },
        2: { text: '5G', status: 'Processing' },
      },
    },
    {
      title: '游戏客户端',
      dataIndex: 'gameClient',
      width: 120,
      align: 'center',
      search: false,
    },
    {
      title: '游戏服务器',
      dataIndex: 'gameServer',
      width: 120,
      align: 'center',
      search: false,
    },
    {
      title: '游戏开始时间',
      dataIndex: 'beginTime',
      width: 180,
      align: 'center',
    },
    {
      title: '游戏结束时间',
      dataIndex: 'endTime',
      width: 180,
      align: 'center',
    },
    {
      title: '最后关卡',
      dataIndex: 'lastStuck',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '游戏照片',
      dataIndex: 'gamePictureList',
      align: 'center',
      search: false,
      render: (_, record) => (
        <Button
          type="link"
          icon={<QrcodeOutlined />}
          onClick={() => {
            if (record.gamePictureList && record.gamePictureList.length > 0) {
              Modal.info({
                title: '游戏图片',
                width: 800,
                content: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 16 }}>
                    {record.gamePictureList.map((pic, index) => (
                      <Image
                        key={index}
                        src={pic}
                        alt={`游戏图片${index + 1}`}
                        style={{ width: 180, height: 120, objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                ),
                okText: '关闭',
              });
            } else {
              message.info('暂无游戏图片');
            }
          }}
        >
          查看图片
        </Button>
      ),
    },
  ];

  return (
    <>
      <ProTable<Player>
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          try {
            const playerList = await getPlayerList({
              pageSize: params.pageSize,
              pageNum: params.current,
              beginDate: dateRange[0],
              endDate: dateRange[1],
              ...params,
            });
            return {
              data: playerList.data || [],
              success: true,
              total: playerList.total || 0,
            };
          } catch (error) {
            message.error('获取玩家数据失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
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
          reload: false,
          setting: false,
          density: false,
        }}
        dateFormatter="string"
        headerTitle="玩家信息表"
        toolBarRender={() => [
          <DatePicker.RangePicker
            key="datePicker"
            defaultValue={[dayjs(), dayjs()]}
            onChange={(value) => {
              if (value) {
                setDateRange([
                  dayjs(value[0]).format('YYYY-MM-DD'),
                  dayjs(value[1]).format('YYYY-MM-DD'),
                ]);
              } else {
                setDateRange([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
              }
            }}
          />,
          <Button
            key="search"
            type="primary"
            onClick={() => {
              tableRef.current?.reload();
            }}
          >
            <SearchOutlined /> 查询玩家
          </Button>,
        ]}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default PlayerList;
