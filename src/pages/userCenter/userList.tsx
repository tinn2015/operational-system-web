// 用户管理页面

import { getRoleListForCorp } from '@/services/role';
import { deleteUser, getUserList, saveUser } from '@/services/user';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Col, Divider, message, Popconfirm, Row, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const UserCenter: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const { initialState } = useModel('@@initialState');
  const [editingUser, setEditingUser] = useState<API.User | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [roleValueEnum, setRoleValueEnum] = useState<any>({});

  useEffect(() => {
    getRoleListForCorp().then((res) => {
      // const roleListEnum: Record<string, any> = {};
      // res.forEach((item: any) => {
      //   roleListEnum[item.id] = {
      //     text: item.roleName,
      //     original: item,
      //   };
      // });
      console.log('roleListEnum', res);
      setRoleList(res as any[]);
      const roleValueEnum: Record<string, { text: string }> = {};
      res.forEach((item: any) => {
        roleValueEnum[item.id] = { text: item.roleName };
      });
      console.log('roleValueEnum', roleValueEnum);
      setRoleValueEnum(roleValueEnum);
    });
  }, []);

  // TODO: 替换为实际的 API 调用
  const handleDelete = async (record: API.User) => {
    try {
      const res = await deleteUser({ userId: record.userId });
      if (res) {
        message.success('删除成功');
        tableRef.current?.reload();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: '账号',
      dataIndex: 'loginId',
      copyable: true,
      ellipsis: true,
      width: 120,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      ellipsis: true,
      width: 120,
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      ellipsis: true,
      width: 120,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      copyable: true,
      width: 120,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      align: 'center',
      valueEnum: {
        1: { text: '男' },
        0: { text: '女' },
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'post',
      width: 180,
      align: 'center',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      width: 150,
      align: 'center',
      render: (_, record) => {
        return record.roleList.map((item: any) => item.roleName).join(',');
      },
      valueEnum: roleValueEnum,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      valueEnum: {
        1: { text: '启用', status: 'success' },
        0: { text: '禁用', status: 'error' },
      },
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   width: 180,
    //   align: 'center',
    // },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              console.log('编辑用户', record);

              setEditingUser({
                ...record,
                roleType: record.roleList.map((item: any) => item.id),
              });
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该用户吗？"
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
      <ProTable<API.User>
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const userList = await getUserList({
            pageSize: params.pageSize,
            pageNum: params.current,
            ...params,
          });
          console.log('userList', userList);
          return {
            data: userList.items,
            success: true,
            total: userList.count,
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
        headerTitle="用户管理"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setEditingUser(undefined);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增用户
          </Button>,
        ]}
      />

      <ModalForm
        formRef={formRef}
        title={editingUser ? '编辑用户' : '新增用户'}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
        }}
        initialValues={editingUser}
        modalProps={{
          destroyOnClose: true,
          afterClose: () => {
            console.log('==formRef afterClose==');
            setEditingUser(undefined);
            formRef.current?.resetFields();
          },
        }}
        onFinish={async (values) => {
          console.log('提交用户信息', values, editingUser);
          const _roleList = roleList.filter((item) => values.roleType.includes(item.id));
          const newValues = editingUser
            ? { ...values, userId: editingUser.userId, roleList: _roleList }
            : {
                ...values,
                corpId: initialState?.currentUser?.corpId,
                roleList: _roleList,
              };
          console.log('==[新增用户]newValues==', newValues);
          const res = await saveUser(newValues);
          if (res) {
            message.success('提交成功');
            tableRef.current?.reload();
            setCreateModalVisible(false);
            formRef.current?.resetFields();
            return true;
          }
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <ProFormText
              name="userName"
              label="用户姓名"
              placeholder="请输入用户姓名"
              rules={[{ required: true, message: '请输入用户姓名' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="loginId"
              label="登录账号"
              placeholder="请输入工号或者手机号"
              rules={[{ required: true, message: '请输入工号或者手机号' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormText name="nickName" label="昵称" placeholder="请输入昵称" />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="sex"
              label="性别"
              options={[
                { label: '男', value: '1' },
                { label: '女', value: '0' },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="roleType"
              label="角色类型"
              mode="multiple"
              options={roleList.map((item) => ({
                label: item.roleName,
                value: item.id,
              }))}
            />
          </Col>
          <Col span={12}>
            <ProFormText name="email" label="邮箱" placeholder="请输入邮箱" />
          </Col>
          <Col span={12}>
            <ProFormText name="post" label="岗位" placeholder="请输入岗位" />
          </Col>
          {/* <Col span={12}>
            <ProFormSelect
              name="role"
              label="角色"
              options={[
                { label: '管理员', value: 1 },
                { label: '普通用户', value: 2 },
                { label: '访客', value: 3 },
              ]}
              rules={[{ required: true, message: '请选择角色' }]}
            />
          </Col> */}
          {/* <Col span={12}>
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
              rules={[{ required: true, message: '请选择状态' }]}
            />
          </Col> */}
        </Row>
      </ModalForm>
    </>
  );
};

export default UserCenter;
