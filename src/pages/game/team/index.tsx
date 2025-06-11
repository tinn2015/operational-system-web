/**
 * 组队管理
 */
import { getRecentProducts } from '@/services/product';
import {
  disbandTeam,
  getTeamDetail,
  getTeamList,
  quitTeam,
  saveTeam,
  unbindHeadset,
} from '@/services/team';
import { DeleteOutlined, PlusOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

// 队伍类型定义
interface TeamMember {
  id: string;
  userName: string;
  role: string;
  joinTime: string;
}

interface TeamType {
  id: string;
  teamId: string;
  teamName: string;
  gameName: string;
  gameSessionId: string;
  maxMembers: number;
  currentMembers: number;
  isFull: boolean;
  gameStatus: string;
  members: TeamMember[];
  players: API.Player[];
}

const TeamList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [editingTeam, setEditingTeam] = useState<TeamType | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentTeam, setCurrentTeam] = useState<TeamType | undefined>();
  const [playerModalVisible, setPlayerModalVisible] = useState<boolean>(false);
  const [currentTeamPlayers, setCurrentTeamPlayers] = useState<API.Player[]>([]);
  const [optionalProducts, setOptionalProducts] = useState<API.Product[]>([]);
  const [teamDateRange, setTeamDateRange] = useState<[string, string]>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const [listingList, setListingList] = useState<API.timeRange[]>([]);
  const [session, setSession] = useState<{
    showTime: string;
    beginTime: string;
    endTime: string;
    quantity: number;
    id?: string;
  } | null>(null);

  // 删除队伍
  const handleDisband = async (record: TeamType) => {
    try {
      await disbandTeam({ teamId: record.teamId });
      message.success('解散成功');
      tableRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 获取队伍详情
  const fetchTeamDetail = async (teamId: string) => {
    try {
      const response = await getTeamDetail({ teamId });
      setCurrentTeamPlayers(response.memberList || []);
    } catch (error) {
      message.error('获取队伍详情失败');
    }
  };

  // 踢出玩家
  const handleQuitPlayer = async (playerId: string) => {
    try {
      const res = await quitTeam({ teamId: currentTeam?.teamId, uid: playerId });
      console.log('踢出成功', res);
      if (res.code === 200) {
        message.success('踢出成功');
        fetchTeamDetail(currentTeam?.teamId || '');
      }
    } catch (error) {
      message.error('踢出失败');
    }
  };

  // 打开玩家管理模态框
  const showPlayerModal = async (record: TeamType) => {
    setCurrentTeam(record);
    // await fetchTeamDetail(record.teamId);
    setPlayerModalVisible(true);
  };

  // 解绑头显
  const handleUnbindHeadset = async (player: API.Player) => {
    try {
      const res = await unbindHeadset({ uid: player.id });
      console.log('解绑成功', res);
      if (res.code === 200) {
        message.success('解绑成功');
        fetchTeamDetail(currentTeam?.teamId || '');
      }
    } catch (error) {
      message.error('解绑失败');
    }
  };

  const columns: ProColumns<TeamType>[] = [
    {
      title: '队伍名称',
      dataIndex: 'teamName',
      copyable: true,
      ellipsis: true,
      width: 200,
      align: 'center',
    },
    {
      title: '游戏名称',
      dataIndex: 'productName',
      width: 150,
      align: 'center',
    },
    {
      title: '队伍批次',
      dataIndex: 'teamCode',
      width: 150,
      align: 'center',
    },
    {
      title: '玩家数量',
      dataIndex: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: '游戏状态',
      dataIndex: 'gameStatus',
      width: 200,
      align: 'center',
      valueEnum: {
        0: { text: '组队中', status: 'processing' },
        1: { text: '进行中', status: 'success' },
        2: { text: '结束', status: 'error' },
        3: { text: '即将结束', status: 'warning' },
      },
    },
    {
      title: '游戏服务器',
      dataIndex: 'gameServer',
      width: 200,
      align: 'center',
      search: false,
    },
    {
      title: '游戏时长',
      dataIndex: 'gameDuration',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '当前关卡',
      dataIndex: 'currentStuck',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '游戏开始时间',
      dataIndex: 'beginTime',
      width: 150,
      align: 'center',
      search: false,
    },
    {
      title: '游戏结束时间',
      dataIndex: 'endTime',
      width: 150,
      align: 'center',
      search: false,
    },
    {
      title: '结束关卡',
      dataIndex: 'lastStuck',
      width: 100,
      align: 'center',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      align: 'center',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            key="players"
            type="link"
            icon={<UserAddOutlined />}
            onClick={() => showPlayerModal(record)}
          >
            查看玩家
          </Button>
          <Button
            key="edit"
            type="link"
            onClick={async () => {
              const optionalProducts = await getRecentProducts();
              setOptionalProducts(optionalProducts);
              console.log('optionalProducts', optionalProducts);
              setEditingTeam(record);
              console.log('editingTeam', record);
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该队伍吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDisband(record)}
          >
            <Button key="delete" type="link" danger>
              解散
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<TeamType>
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          const teamList = await getTeamList({
            pageSize: params.pageSize,
            pageNum: params.current,
            beginDate: teamDateRange[0],
            endDate: teamDateRange[1],
            ...params,
          });
          return {
            data: teamList.data || [],
            success: true,
            total: teamList.total || 0,
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
        headerTitle="组队管理"
        toolBarRender={() => [
          <DatePicker.RangePicker
            key="datePicker"
            defaultValue={[dayjs(), dayjs()]}
            onChange={(value) => {
              if (value) {
                setTeamDateRange([
                  dayjs(value[0]).format('YYYY-MM-DD'),
                  dayjs(value[1]).format('YYYY-MM-DD'),
                ]);
              } else {
                setTeamDateRange([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
              }
            }}
          />,
          <Button
            key="add"
            type="primary"
            onClick={() => {
              tableRef.current?.reload();
            }}
          >
            <SearchOutlined /> 查询队伍
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={async () => {
              const optionalProducts = await getRecentProducts();
              setOptionalProducts(optionalProducts);
              setEditingTeam(undefined);
              setListingList([]);
              setSession(null);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 创建队伍
          </Button>,
        ]}
      />

      <ModalForm
        formRef={formRef}
        title={editingTeam ? '编辑队伍' : '创建队伍'}
        open={createModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setEditingTeam(undefined);
            formRef.current?.resetFields();
            setSession(null);
          }
          setCreateModalVisible(visible);
        }}
        initialValues={editingTeam}
        modalProps={{
          destroyOnClose: true,
          afterClose: () => {
            setEditingTeam(undefined);
            formRef.current?.resetFields();
          },
        }}
        onFinish={async (values) => {
          try {
            if (!session) {
              message.error('请选择场次');
              return false;
            }

            await saveTeam({
              ...values,
              productName: optionalProducts.find((product) => product.id === values.productId)
                ?.productName,
              // sessionInfo: session,
              showTime: session.showTime,
              beginTime: session.beginTime,
              endTime: session.endTime,
              listingId: session.id,
              id: editingTeam?.id,
            });
            message.success('提交成功');
            tableRef.current?.reload();
            setCreateModalVisible(false);
            formRef.current?.resetFields();
            setSession(null);
            return true;
          } catch (error) {
            message.error('提交失败');
            return false;
          }
        }}
      >
        <ProFormText
          name="teamName"
          label="队伍名称"
          placeholder="请输入队伍名称"
          rules={[{ required: true, message: '请输入队伍名称' }]}
        />
        <ProFormSelect
          name="productId"
          label="游戏名称"
          placeholder="请选择游戏"
          options={optionalProducts.map((product) => ({
            label: product.productName,
            value: product.id,
          }))}
          onChange={(value) => {
            console.log('value', value);
            setListingList(
              optionalProducts.find((product) => product.id === value)?.listingList || [],
            );
            setSession(null); // 重置场次选择
          }}
          rules={[{ required: true, message: '请选择游戏' }]}
        />
        <Form.Item
          // name="listingInfo"
          label="场次"
          rules={[{ required: true, message: '请选择场次' }]}
        >
          <div className="session-tags">
            {listingList.map((item, index) => (
              <Tag
                key={index}
                color={session?.beginTime === item.beginTime ? 'blue' : 'default'}
                style={{
                  padding: '6px 12px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => {
                  setSession(item);
                  // 更新表单字段值
                  // formRef.current?.setFieldsValue({
                  //   // listingInfo: JSON.stringify(newSession),
                  //   beginTime: newSession.beginTime,
                  //   endTime: newSession.endTime,
                  //   showTime: newSession.showTime,
                  // });
                }}
              >
                {dayjs(item.showTime).format('YYYY-MM-DD')} {dayjs(item.beginTime).format('HH:mm')}-
                {dayjs(item.endTime).format('HH:mm')}
              </Tag>
            ))}
            {listingList.length === 0 && <span style={{ color: '#999' }}>请先选择游戏</span>}
          </div>
        </Form.Item>
        <ProFormDigit
          name="quantityMax"
          label="最大队伍人数"
          placeholder="请输入最大队伍人数"
          min={1}
          max={4}
          initialValue={4}
          rules={[{ required: true, message: '请输入最大队伍人数, 最多4人' }]}
        />
        <ProFormTextArea name="remark" label="备注" placeholder="请输入队伍备注信息" />
      </ModalForm>

      {/* 玩家管理模态框 */}
      <Modal
        title="队伍玩家信息"
        open={playerModalVisible}
        onCancel={() => {
          setPlayerModalVisible(false);
          // setCurrentTeamPlayers([]);
        }}
        footer={null}
        width={1000}
      >
        <Row gutter={[16, 16]}>
          {currentTeamPlayers.length === 0 && (
            <Col span={24}>
              <Empty description="玩家还未组队哦~" />
            </Col>
          )}
          {currentTeamPlayers.map((player) => (
            <Col span={12} key={player.userId}>
              <Card
                title={player.nickName}
                extra={
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleQuitPlayer(player.id)}
                    danger
                    size="small"
                  >
                    踢出
                  </Button>
                }
              >
                <p>用户ID: {player.userId}</p>
                <p>
                  性别: {player.sexCode === '1' ? '男' : player.sexCode === '2' ? '女' : '未知'}
                </p>
                <p>身高: {player.height}</p>
                <p>年龄段: {player.age === 1 ? '成人' : player.age === 2 ? '儿童' : '未知'}</p>
                <p>二维码: {player.qrCode}</p>
                <p>
                  头盔ID: {player.headSetId}
                  <Button
                    type="link"
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleUnbindHeadset(player)}
                  >
                    解绑
                  </Button>
                </p>
                <p>游戏名称: {player.productName}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};

export default TeamList;
