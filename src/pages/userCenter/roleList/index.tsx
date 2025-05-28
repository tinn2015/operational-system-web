/**
 * 角色管理
 */
import { deleteRole, getRoleList, saveRole } from '@/services/role';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';

// 角色类型定义
interface RoleType {
  id: string;
  roleName: string;
  roleType: string;
  status: number;
  remark?: string;
}

const RoleList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [editingRole, setEditingRole] = useState<RoleType | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  // 删除角色
  const handleDelete = async (record: RoleType) => {
    try {
      await deleteRole({ roleId: record.id });
      message.success('删除成功');
      tableRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      copyable: true,
      ellipsis: true,
      width: 200,
      align: 'center',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      width: 150,
      align: 'center',
      valueEnum: {
        'system-admin': { text: '系统管理员' },
        'corp-admin': { text: '企业管理员' },
        'venue-admin': { text: '场馆管理员' },
        'normal-user': { text: '普通用户' },
      },
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      valueEnum: {
        1: { text: '启用', status: 'success' },
        0: { text: '禁用', status: 'error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 200,
      align: 'center',
    },
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
              setEditingRole(record);
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该角色吗？"
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
      <ProTable<RoleType>
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          const roleList = await getRoleList({
            pageSize: params.pageSize,
            pageNum: params.current,
            ...params,
          });
          return {
            data: roleList.items || [],
            success: true,
            total: roleList.count || 0,
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
        headerTitle="角色管理"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setEditingRole(undefined);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增角色
          </Button>,
        ]}
      />

      <ModalForm
        formRef={formRef}
        title={editingRole ? '编辑角色' : '新增角色'}
        open={createModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setEditingRole(undefined);
            formRef.current?.resetFields();
          }
          setCreateModalVisible(visible);
        }}
        initialValues={editingRole}
        onFinish={async (values) => {
          try {
            await saveRole({
              ...values,
              id: editingRole?.id,
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
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormSelect
          name="roleType"
          label="角色类型"
          placeholder="请选择角色类型"
          options={[
            { label: '系统管理员', value: 'system-admin' },
            { label: '企业管理员', value: 'corp-admin' },
            { label: '场馆管理员', value: 'venue-admin' },
            { label: '普通用户', value: 'normal-user' },
          ]}
          rules={[{ required: true, message: '请选择角色类型' }]}
        />
        <ProFormSelect
          name="status"
          label="角色状态"
          placeholder="请选择角色状态"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
          rules={[{ required: true, message: '请选择角色状态' }]}
        />
        <ProFormTextArea name="remark" label="备注" placeholder="请输入备注信息" />
      </ModalForm>
    </>
  );
};

export default RoleList;
