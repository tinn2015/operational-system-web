/**
 * 玩家信息表
 */
import AutoRefreshControls from '@/components/AutoRefreshControls';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import { exportPlayer } from '@/services/common';
import { getPlayerList } from '@/services/player';
import { ExportOutlined, QrcodeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Image, message, Modal, Space } from 'antd';
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
  const formRef = useRef<ProFormInstance>();

  // const [gameContentEnum, setGameContentEnum] = useState<Record<string, string>>({});

  // useEffect(() => {
  //   const getGameContentList = async () => {
  //     const res = await queryGameContent();
  //     if (res) {
  //       const gameContentEnum = res.reduce((acc: Record<string, string>, item: API.GameContent) => {
  //         acc[item.contentId] = item.contentName;
  //         return acc;
  //       }, {});
  //       console.log('gameContentEnum', gameContentEnum);
  //       setGameContentEnum(gameContentEnum);
  //     }
  //   };
  //   getGameContentList();
  // }, []);

  // 使用自定义Hook管理自动刷新
  const { autoRefresh, setAutoRefresh, refreshInterval, setRefreshInterval } = useAutoRefresh(
    () => {
      tableRef.current?.reload();
    },
  );

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
      title: '游戏名称',
      dataIndex: 'productName',
      copyable: true,
      ellipsis: true,
      width: 150,
      align: 'center',
      // valueEnum: gameContentEnum,
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
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
      valueEnum: {
        1: { text: '男', status: 'Processing' },
        2: { text: '女', status: 'Success' },
        // 3: { text: '未知', status: 'Default' },
      },
    },
    // {
    //   title: '身高(cm)',
    //   dataIndex: 'height',
    //   width: 80,
    //   align: 'center',
    //   search: false,
    // },
    {
      title: '年龄段',
      dataIndex: 'age',
      width: 100,
      align: 'center',
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
      valueEnum: {
        1: { text: '成人', status: 'Processing' },
        2: { text: '青少年', status: 'Warning' },
        3: { text: '儿童', status: 'Success' },
      },
    },
    {
      title: '票务类型',
      dataIndex: 'ticketType',
      width: 150,
      align: 'center',
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
      valueEnum: {
        1: { text: '营业售票', status: 'Processing' },
        2: { text: '赠票', status: 'Success' },
      },
    },
    // {
    //   title: '关联卡券',
    //   dataIndex: 'relatedCoupons',
    //   width: 100,
    //   align: 'center',
    //   search: false,
    // },
    // {
    //   title: '购票用户',
    //   dataIndex: 'ticketUser',
    //   width: 100,
    //   align: 'center',
    // },
    // {
    //   title: '照片领取用户',
    //   dataIndex: 'photoUser',
    //   width: 100,
    //   align: 'center',
    //   search: false,
    // },
    {
      title: '游戏状态',
      dataIndex: 'gameStatus',
      width: 120,
      align: 'center',
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
      valueEnum: {
        0: { text: '组队中', status: 'processing' },
        1: { text: '游戏中', status: 'success' },
        2: { text: '结束', status: 'error' },
        // 3: { text: '即将结束', status: 'warning' },
      },
    },
    {
      title: '游戏时长',
      dataIndex: 'gameDuration',
      width: 120,
      align: 'center',
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
      valueEnum: {
        1: { text: '小于5分钟', status: 'processing' },
        2: { text: '5-25分钟', status: 'success' },
        3: { text: '大于25分钟', status: 'error' },
      },
    },
    {
      title: '当前关卡',
      dataIndex: 'currentStuck',
      width: 150,
      align: 'center',
      search: false,
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
      fieldProps: {
        mode: 'multiple', // 支持多选
      },
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
      search: false,
    },
    {
      title: '游戏结束时间',
      dataIndex: 'endTime',
      width: 180,
      align: 'center',
      search: false,
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
              Modal.success({
                title: '游戏图片',
                width: 800,
                content: (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginTop: 16,
                      justifyContent: 'center',
                      padding: '0 24px',
                    }}
                  >
                    {record.gamePictureList.map((pic, index) => (
                      <Image
                        key={index}
                        src={pic}
                        alt={`游戏图片${index + 1}`}
                        style={{
                          width: 220,
                          height: 120,
                          objectFit: 'contain',
                          border: '1px solid #e5e6eb',
                          borderRadius: 4,
                          background: '#fafbfc',
                        }}
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
      <ProTable<Player>
        actionRef={tableRef}
        formRef={formRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          try {
            // 处理多选参数，将数组转换为逗号分隔的字符串
            const processedParams: any = {
              pageSize: params.pageSize,
              pageNum: params.current,
              beginDate: dateRange[0],
              endDate: dateRange[1],
            };

            // 处理多选数组参数
            // ProTable多选时会传递数组格式，如：sexCode: ['1', '2']
            // 后端期望逗号分隔格式，如：sexCode=1,2
            Object.keys(params).forEach((key) => {
              if (Array.isArray(params[key])) {
                // 将数组转换为逗号分隔的字符串
                processedParams[key] = params[key].join(',');
              } else if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                // 只传递非空值
                processedParams[key] = params[key];
              }
            });

            console.log('处理后的请求参数:', processedParams);
            // 示例输出：
            // sexCode: ['1', '2'] -> sexCode: '1,2'
            // age: ['1', '3'] -> age: '1,3'
            // nickName: '张三' -> nickName: '张三'

            const playerList = await getPlayerList(processedParams);
            return {
              data: playerList.data || [],
              success: true,
              total: playerList.total || 0,
            };
          } catch (error) {
            console.error('获取玩家数据失败:', error);
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
              tableRef.current?.reload();
            }}
          />,
          // <Button
          //   key="search"
          //   type="primary"
          //   onClick={() => {
          //     tableRef.current?.reload();
          //   }}
          // >
          //   <SearchOutlined /> 查询玩家
          // </Button>,
          <Button
            key="export"
            type="primary"
            onClick={async () => {
              try {
                // 获取表单的筛选参数
                const formValues = formRef.current?.getFieldsValue();
                console.log('表单筛选参数:', formValues);

                // 处理筛选参数，转换为导出接口需要的格式
                const exportParams: any = {
                  pageNum: 1,
                  pageSize: 10000,
                  beginDate: dateRange[0],
                  endDate: dateRange[1],
                };

                // 处理多选数组参数
                Object.keys(formValues).forEach((key) => {
                  if (Array.isArray(formValues[key])) {
                    // 将数组转换为逗号分隔的字符串
                    exportParams[key] = formValues[key].join(',');
                  } else if (
                    formValues[key] !== undefined &&
                    formValues[key] !== null &&
                    formValues[key] !== ''
                  ) {
                    // 只传递非空值
                    exportParams[key] = formValues[key];
                  }
                });

                console.log('导出参数:', exportParams);

                const res = await exportPlayer(exportParams);
                console.log('res', res);

                // 自动下载 Blob 文件
                try {
                  const blob = (res as any).data as Blob;
                  if (!blob || !(blob instanceof Blob)) {
                    console.error('导出失败：返回数据不是文件流');
                    message.error('导出失败：返回数据不是文件流');
                    return;
                  }

                  // 从响应头提取文件名（兼容 Headers 对象或普通对象）
                  const headers: any = (res as any).headers || (res as any).response?.headers;
                  const cd = headers?.get
                    ? headers.get('content-disposition')
                    : headers?.['content-disposition'] || '';
                  let fileName = '玩家信息表.xlsx';

                  // 分析content-disposition头
                  console.log('Content-Disposition:', cd);
                  // 方式1：处理 filename*=UTF-8'' 格式
                  let match = cd.match(/filename=([^;\s]+)/i);
                  if (match) {
                    fileName = decodeURIComponent(match[1]);
                    console.log('解析UTF-8文件名:', fileName);
                  }

                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = fileName;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);

                  message.success('导出成功');
                } catch (e) {
                  console.error('下载文件失败', e);
                  message.error('下载文件失败');
                }
              } catch (error) {
                console.error('导出失败:', error);
                message.error('导出失败，请稍后重试');
              }
            }}
          >
            <ExportOutlined /> 导出表格
          </Button>,
          <Space key="refreshControls">{refreshControls}</Space>,
        ]}
      />
    </>
  );
};

export default PlayerList;
