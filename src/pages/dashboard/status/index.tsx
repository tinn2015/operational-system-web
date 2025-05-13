import { useModel } from '@umijs/max';
import React, { useState } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Status: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [users, setUsers] = useState<UserType[]>([
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '用户' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<UserType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: UserType) => {
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newUser = {
        ...values,
        id: values.id || users.length + 1,
      };
      
      if (values.id) {
        setUsers(users.map(user => user.id === values.id ? newUser : user));
      } else {
        setUsers([...users, newUser]);
      }
      
      setIsModalOpen(false);
      message.success('保存成功');
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>添加用户</Button>
      </div>
      
      <Table columns={columns} dataSource={users} rowKey="id" />

      <Modal
        title="用户信息"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请输入角色' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Status;
