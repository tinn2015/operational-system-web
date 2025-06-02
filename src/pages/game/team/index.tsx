/**
 * 组队管理
 */
import {
  disbandTeam,
  getTeamDetail,
  getTeamList,
  joinTeam,
  quitTeam,
  saveTeam,
} from '@/services/team';
import {
  DeleteOutlined,
  PlusOutlined,
  QrcodeOutlined,
  UserAddOutlined,
  WarningTwoTone,
} from '@ant-design/icons';
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
  Col,
  Descriptions,
  Divider,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

// 玩家类型定义
interface Player {
  id: string;
  nickName: string;
  gender: string;
  height: number;
  age: number;
  qrCode: string;
  headsetId: string;
}

// 队伍类型定义
interface TeamMember {
  id: string;
  userName: string;
  role: string;
  joinTime: string;
}

interface TeamType {
  teamId: string;
  teamName: string;
  gameName: string;
  gameSessionId: string;
  maxMembers: number;
  currentMembers: number;
  isFull: boolean;
  gameStatus: string;
  members: TeamMember[];
  players: Player[];
}

const TeamList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [editingTeam, setEditingTeam] = useState<TeamType | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentTeam, setCurrentTeam] = useState<TeamType | undefined>();
  const [playerModalVisible, setPlayerModalVisible] = useState<boolean>(false);
  const [currentTeamPlayers, setCurrentTeamPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

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

  // 查看队伍详情
  const showTeamDetail = (record: TeamType) => {
    setCurrentTeam(record);
    setDetailModalVisible(true);
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

  // 打开玩家管理模态框
  const showPlayerModal = async (record: TeamType) => {
    setCurrentTeam(record);
    await fetchTeamDetail(record.teamId);
    setPlayerModalVisible(true);
  };

  // 删除玩家
  const handleDeletePlayer = async (playerId: string) => {
    try {
      await quitTeam({
        teamId: currentTeam?.teamId,
        playerId,
      });
      message.success('删除成功');
      fetchTeamDetail(currentTeam?.teamId!);
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 添加玩家
  const handleAddPlayers = async () => {
    if (!selectedPlayers.length) {
      message.warning('请选择要添加的玩家');
      return;
    }
    try {
      await joinTeam({
        teamId: currentTeam?.teamId,
        playerIds: selectedPlayers,
      });
      message.success('添加成功');
      setSelectedPlayers([]);
      fetchTeamDetail(currentTeam?.teamId!);
    } catch (error) {
      message.error('添加失败');
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
      title: '场次ID',
      dataIndex: 'productId',
      width: 150,
      align: 'center',
    },
    {
      title: '最大队伍人数',
      dataIndex: 'quantityMax',
      width: 100,
      align: 'center',
    },
    {
      title: '当前队伍人数',
      dataIndex: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: '游戏状态',
      dataIndex: 'gameStatus',
      width: 100,
      align: 'center',
      valueEnum: {
        0: { text: '未开始', status: 'error' },
        1: { text: '进行中', status: 'success' },
        2: { text: '已结束', status: 'warning' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          {/* <Button
            key="view"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showTeamDetail(record)}
          >
            详情
          </Button> */}
          <Button
            key="players"
            type="link"
            icon={<UserAddOutlined />}
            onClick={() => showPlayerModal(record)}
          >
            编辑玩家
          </Button>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setEditingTeam(record);
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

  const memberColumns = [
    {
      title: '成员姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color={role === '队长' ? 'blue' : 'default'}>{role}</Tag>,
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
      key: 'joinTime',
    },
  ];

  // 玩家列表列定义
  const playerColumns = [
    {
      title: '玩家昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => <Tag color={gender === '男' ? 'blue' : 'pink'}>{gender}</Tag>,
    },
    {
      title: '身高',
      dataIndex: 'height',
      key: 'height',
      render: (height: number) => `${height}cm`,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '头显ID',
      dataIndex: 'headsetId',
      key: 'headsetId',
    },
    {
      title: '业务二维码',
      key: 'qrCode',
      render: (_, record: Player) => (
        <Button
          type="link"
          icon={<QrcodeOutlined />}
          onClick={() => {
            Modal.info({
              title: '业务二维码',
              content: (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Image src={record.qrCode} alt="二维码" style={{ maxWidth: 200 }} />
                </div>
              ),
              okText: '关闭',
            });
          }}
        >
          查看
        </Button>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Player) => (
        <Popconfirm
          title="确认删除"
          description="确定要删除该玩家吗？"
          onConfirm={() => handleDeletePlayer(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // 选择已经录入的玩家
  const selectPlayer = () => {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningTwoTone style={{ marginRight: 8 }} />
          <span style={{ fontSize: 14, color: '#1890ff' }}>请提前小程序扫码完成玩家录入</span>
        </div>
        <ProFormSelect
          name="players"
          label="选择玩家"
          mode="multiple"
          placeholder="请选择要添加的玩家"
          width={300}
          fieldProps={{
            value: selectedPlayers,
            onChange: setSelectedPlayers,
            // options: async () => {
            //   // 获取可选玩家列表
            //   const players = await getAvailablePlayers();
            //   return players.map((p: Player) => ({
            //     label: p.nickName,
            //     value: p.id,
            //   }));
            // },
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddPlayers}
          style={{ marginTop: 16 }}
        >
          添加选中玩家
        </Button>
      </div>
    );
  };

  // 手动添加玩家
  const addPlayer = () => {
    return <div>手动添加玩家</div>;
  };

  return (
    <>
      <ProTable<TeamType>
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          const teamList = await getTeamList({
            pageSize: params.pageSize,
            pageNum: params.current,
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
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setEditingTeam(undefined);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增队伍
          </Button>,
        ]}
      />

      <ModalForm
        formRef={formRef}
        title={editingTeam ? '编辑队伍' : '新增队伍'}
        open={createModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setEditingTeam(undefined);
            formRef.current?.resetFields();
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
            await saveTeam({
              ...values,
              id: editingTeam?.id,
            });
            message.success('提交成功');
            tableRef.current?.reload();
            setCreateModalVisible(false);
            formRef.current?.resetFields();
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
        <ProFormText
          name="productName"
          label="游戏名称"
          placeholder="请输入游戏名称"
          rules={[{ required: true, message: '请输入游戏名称' }]}
        />
        <ProFormText
          name="productId"
          label="游戏场次"
          placeholder="请输入游戏场次"
          rules={[{ required: true, message: '请输入游戏场次' }]}
        />
        <ProFormDigit
          name="quantityMax"
          label="最大队伍人数"
          placeholder="请输入最大队伍人数"
          min={1}
          max={10}
          disabled
          initialValue={4}
          rules={[{ required: true, message: '请输入最大队伍人数' }]}
        />
        {/* <ProFormSelect
          name="gameStatus"
          label="游戏状态"
          placeholder="请选择游戏状态"
          options={[
            { label: '未开始', value: 'not_started' },
            { label: '进行中', value: 'in_progress' },
            { label: '已结束', value: 'finished' },
          ]}
          rules={[{ required: true, message: '请选择游戏状态' }]}
        /> */}
        <ProFormTextArea name="remark" label="备注" placeholder="请输入队伍备注信息" />
      </ModalForm>

      <Modal
        title="队伍详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentTeam && (
          <>
            <Descriptions column={2}>
              <Descriptions.Item label="队伍名称">{currentTeam.teamName}</Descriptions.Item>
              <Descriptions.Item label="最大队伍人数">{currentTeam.maxMembers}</Descriptions.Item>
              <Descriptions.Item label="当前人数">{currentTeam.currentMembers}</Descriptions.Item>
              <Descriptions.Item label="游戏名称">{currentTeam.gameName}</Descriptions.Item>
              <Descriptions.Item label="游戏场次">{currentTeam.gameSessionId}</Descriptions.Item>
              <Descriptions.Item label="游戏状态">
                <Tag
                  color={
                    currentTeam.gameStatus === 'in_progress'
                      ? 'processing'
                      : currentTeam.gameStatus === 'finished'
                        ? 'success'
                        : 'default'
                  }
                >
                  {currentTeam.gameStatus === 'not_started'
                    ? '未开始'
                    : currentTeam.gameStatus === 'in_progress'
                      ? '进行中'
                      : '已结束'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <h4>队伍成员</h4>
            <Table
              columns={memberColumns}
              dataSource={currentTeam.members}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>

      {/* 玩家管理模态框 */}
      <Modal
        title="队伍玩家管理"
        open={playerModalVisible}
        onCancel={() => {
          setPlayerModalVisible(false);
          setSelectedPlayers([]);
        }}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: 16 }}>
          <div>
            <Tabs
              defaultActiveKey="1"
              type="card"
              items={[
                {
                  key: '1',
                  label: '选择玩家',
                  children: selectPlayer(),
                },
                {
                  key: '2',
                  label: '手动添加玩家',
                  children: addPlayer(),
                },
              ]}
            />
          </div>
        </div>
        <Divider />
        {/* <Table
          columns={playerColumns}
          dataSource={currentTeamPlayers}
          rowKey="id"
          pagination={false}
        /> */}
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>当前玩家信息：</div>
        <Row gutter={16}>
          <Col span={12}>
            <Input placeholder="请输入玩家昵称" />
          </Col>
          <Col span={12}>
            <Input placeholder="请输入玩家昵称" />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TeamList;
