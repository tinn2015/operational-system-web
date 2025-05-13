import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface UserType {
  id: number;
  username: string;
  realName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createTime: string;
}

const { Option } = Select;

const UserCenter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([
    {
      id: 1,
      username: 'admin',
      realName: '管理员',
      email: 'admin@example.com',
      role: '超级管理员',
      status: 'active',
      createTime: '2024-03-20 10:00:00',
    },
    {
      id: 2,
      username: 'user1',
      realName: '张三',
      email: 'zhangsan@example.com',
      role: '普通用户',
      status: 'active',
      createTime: '2024-03-20 11:00:00',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加用户');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 2,
  });

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
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
      filters: [
        { text: '超级管理员', value: '超级管理员' },
        { text: '普通用户', value: '普通用户' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => handleStatusChange(value)}
        >
          <Option value="active">正常</Option>
          <Option value="inactive">禁用</Option>
        </Select>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理表格变化（分页、筛选、排序）
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setLoading(true);
    // 这里可以调用后端 API 进行数据获取
    setPagination(pagination);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 搜索
  const handleSearch = (values: any) => {
    setLoading(true);
    console.log('搜索条件：', values);
    // 这里可以调用后端 API 进行搜索
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    // 重置后刷新数据
  };

  // 添加用户
  const handleAdd = () => {
    setModalTitle('添加用户');
    form.resetFields();
    setIsModalOpen(true);
  };

  // 编辑用户
  const handleEdit = (record: UserType) => {
    setModalTitle('编辑用户');
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // 删除用户
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk() {
        setUsers(users.filter((user) => user.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 修改用户状态
  const handleStatusChange = (value: string) => {
    message.success('状态修改成功');
  };

  // 提交表单
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newUser = {
        ...values,
        id: values.id || users.length + 1,
        createTime: new Date().toLocaleString(),
      };

      if (values.id) {
        setUsers(users.map((user) => (user.id === values.id ? newUser : user)));
      } else {
        setUsers([...users, newUser]);
      }

      setIsModalOpen(false);
      message.success('保存成功');
    });
  };

  return (
    <div>
      <Card>
        {/* 搜索区域 */}
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="role" label="角色">
                <Select placeholder="请选择角色" allowClear>
                  <Option value="超级管理员">超级管理员</Option>
                  <Option value="普通用户">普通用户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="active">正常</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        </div>

        {/* 用户列表 */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />

        {/* 添加/编辑用户弹窗 */}
        <Modal
          title={modalTitle}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="realName"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="超级管理员">超级管理员</Option>
                <Option value="普通用户">普通用户</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">正常</Option>
                <Option value="inactive">禁用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserCenter;
