// 修改密码
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import React from 'react';

const PasswordSettings: React.FC = () => {
  return (
    <Card title="修改密码" style={{ width: '100%', margin: '24px auto' }}>
      <ProForm
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        onFinish={async (values) => {
          // 这里添加修改密码的 API 调用
          console.log('修改密码', values);
          if (values.newPassword !== values.confirmPassword) {
            message.error('两次输入的密码不一致');
            return false;
          }
          message.success('密码修改成功');
          return true;
        }}
        submitter={{
          searchConfig: {
            submitText: '确认修改',
            resetText: '重置',
          },
        }}
      >
        <ProFormText.Password
          name="oldPassword"
          label="原密码"
          placeholder="请输入原密码"
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
          ]}
        />
        <ProFormText.Password
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
            {
              min: 6,
              message: '密码长度不能少于6位',
            },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
              message: '密码必须包含字母和数字',
            },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="确认新密码"
          placeholder="请再次输入新密码"
          rules={[
            {
              required: true,
              message: '请确认新密码',
            },
            {
              min: 6,
              message: '密码长度不能少于6位',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
      </ProForm>
    </Card>
  );
};

export default PasswordSettings;
