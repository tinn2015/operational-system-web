import { deleteHeadset, getHeadsetList } from '@/services/headset';
import { uploadToObs } from '@/services/softwareUpdate';
import { InboxOutlined, PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from 'antd';
import React, { useRef, useState } from 'react';

const HeadSetList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [deploymentLogVisible, setDeploymentLogVisible] = useState<boolean>(false);

  // 模拟数据 - 在实际项目中这些应该从API获取
  const [gameList] = useState([
    { label: '张壁古堡游戏', value: 'zhangbi_castle' },
    { label: '三里屯探索', value: 'sanlitun_explore' },
    { label: '博物馆之旅', value: 'museum_tour' },
  ]);

  const [storeList] = useState([
    { label: '三里屯', value: 'sanlitun' },
    { label: '济宁博物馆', value: 'jining_museum' },
    { label: '朝阳公园', value: 'chaoyang_park' },
  ]);

  const [cinemaList] = useState([
    { label: '三里屯', value: 'sanlitun_cinema' },
    { label: '济宁博物馆', value: 'jining_cinema' },
    { label: '朝阳公园', value: 'chaoyang_cinema' },
  ]);

  // 部署日志模拟数据
  const [deploymentLogs] = useState([
    {
      id: 1,
      packageName: '张壁古堡游戏内容包.zip',
      deployStore: '三里屯',
      operator: '运维小王',
      operateTime: '2025/08/13 15:23:24',
      deployResult: '部署成功',
      status: 'success',
      details: '设备192.168.50.11、192.168.50.13等，设备数量35',
    },
    {
      id: 2,
      packageName: '串流更新包-头显20250827.zip',
      deployStore: '济宁博物馆',
      operator: '运维小王',
      operateTime: '2025/08/13 15:23:24',
      deployResult: '部署成功',
      status: 'success',
    },
    {
      id: 3,
      packageName: '串流更新包-pc20250827.zip',
      deployStore: '济宁博物馆',
      operator: '运维小王',
      operateTime: '2025/08/13 15:23:24',
      deployResult: '部署成功',
      status: 'success',
    },
    {
      id: 4,
      packageName: '增强脚本-20250817.bat',
      deployStore: '济宁博物馆',
      operator: '运维小王',
      operateTime: '2025/08/13 15:23:24',
      deployResult: '部署成功',
      status: 'success',
    },
    {
      id: 5,
      packageName: '增强脚本-20250821.bat',
      deployStore: '济宁博物馆',
      operator: '运维小王',
      operateTime: '2025/08/13 15:23:24',
      deployResult: '部署成功',
      status: 'success',
    },
  ]);

  // // 使用自定义Hook管理自动刷新
  // const { autoRefresh, setAutoRefresh, refreshInterval, setRefreshInterval } = useAutoRefresh(
  //   () => {
  //     tableRef.current?.reload();
  //   },
  // );

  // 获取串流服务列表
  // const [streamingServerList, setStreamingServerList] = useState<API.Server[]>([]);
  // useEffect(() => {
  //   getServerList({
  //     pageSize: 10000,
  //     pageNum: 1,
  //     serverType: 2,
  //   }).then((res) => {
  //     if (res && res.data) {
  //       setStreamingServerList(res.data);
  //     }
  //   });
  // }, []);

  const handleDeviceOperation = async (type: 'start' | 'stop', record: API.Headset) => {
    const operationText = type === 'start' ? '启动' : '停止';
    console.log('操作设备', type, record);
    try {
      // 这里添加实际的 API 调用
      message.success(`${operationText}设备成功`);
    } catch (error) {
      message.error(`${operationText}设备失败`);
    }
  };

  const handleDelete = async (record: API.Headset) => {
    console.log('删除设备', record);
    const res = await deleteHeadset(record);
    if (res) {
      message.success('删除成功');
      tableRef.current?.reload();
    }
  };

  // 使用自定义组件作为刷新控制
  // const refreshControls = (
  //   <AutoRefreshControls
  //     autoRefresh={autoRefresh}
  //     setAutoRefresh={setAutoRefresh}
  //     refreshInterval={refreshInterval}
  //     setRefreshInterval={setRefreshInterval}
  //   />
  // );

  const columns: ProColumns<API.Headset>[] = [
    {
      title: '绑定服务器IP',
      dataIndex: 'serverIp',
      ellipsis: true,
      align: 'center',
      width: 150,
      // valueEnum: () => {
      //   const values = {};
      //   streamingServerList.forEach((item) => {
      //     values[item.id] = { text: item.serverIp };
      //   });
      //   return values;
      // },
    },
    {
      title: '设备编号',
      dataIndex: 'headsetNo',
      copyable: true,
      ellipsis: true,
      align: 'center',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      // filters: true,
      valueEnum: {
        1: { text: '运行中', status: 'Processing' },
        0: { text: '空闲', status: 'Default' },
        2: { text: '未知', status: 'Default' },
      },
      align: 'center',
      width: 100,
    },
    {
      title: '网络类型',
      dataIndex: 'networkType',
      width: 100,
      // filters: true,
      valueEnum: {
        1: { text: 'wifi' },
        2: { text: '5g' },
      },
      align: 'center',
    },
    {
      title: '剩余电量',
      dataIndex: 'remainElectricity',
      align: 'center',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.remainElectricity > 20 ? 'success' : 'error'}>
          {record.remainElectricity}%
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      ellipsis: true,
      align: 'center',
      render: (_, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              // setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          {record.status !== 2 &&
            (record.status !== 1 ? (
              <Button
                key="start"
                type="link"
                icon={<PlayCircleOutlined />}
                onClick={() => handleDeviceOperation('start', record)}
              >
                启动
              </Button>
            ) : (
              <Popconfirm
                title="确认停止"
                description="确定要停止该设备吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={() => handleDeviceOperation('stop', record)}
              >
                <Button key="stop" type="link" danger icon={<PoweroffOutlined />}>
                  停止
                </Button>
              </Popconfirm>
            ))}
          <Popconfirm
            title="确认删除"
            description="确定要删除该设备吗？"
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
      <ProTable<API.Headset>
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params, sorter, filter) => {
          // 这里替换为实际的 API 请求
          console.log('头显查询', params, sorter, filter);
          const headsetList = await getHeadsetList({
            pageSize: params.pageSize,
            pageNum: params.current,
            ...params,
          });
          console.log('headsetList', headsetList);
          return {
            data: headsetList.data,
            success: true,
            total: headsetList.total,
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
          reload: false,
          setting: false,
          density: false,
        }}
        dateFormatter="string"
        headerTitle="VR头显设备管理"
        toolBarRender={() => [
          <Button
            key="deployment-log"
            type="default"
            onClick={() => {
              setDeploymentLogVisible(true);
            }}
          >
            查看部署日志
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={() => {
              setUploadModalVisible(true);
            }}
          >
            上传软件包
          </Button>,
          // <Space key="refreshControls">{refreshControls}</Space>,
        ]}
      />

      {/* 上传软件包Modal */}
      <ModalForm
        title="上传软件包"
        open={uploadModalVisible}
        onOpenChange={(visible) => {
          setUploadModalVisible(visible);
          if (!visible) {
            setUploadFile(null);
            setUploadProgress(0);
          }
        }}
        width={600}
        onFinish={async (values) => {
          const formData = {
            ...values,
            uploadFile: uploadFile,
          };
          console.log('上传软件包数据：', formData);

          // 验证必填字段
          if (!uploadFile) {
            message.error('请选择要上传的软件包文件');
            return false;
          }

          if (!values.applicableCinemas || values.applicableCinemas.length === 0) {
            message.error('请至少选择一个适用影厅');
            return false;
          }

          try {
            // 这里添加实际的上传 API 调用
            // const result = await uploadSoftwarePackage(formData);
            message.success('软件包上传成功');
            setUploadModalVisible(false);
            tableRef.current?.reload(); // 刷新表格数据
            return true;
          } catch (error) {
            message.error('软件包上传失败，请重试');
            return false;
          }
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        {/* 文件上传区域 */}
        <div style={{ marginBottom: 24 }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".zip,.rar,.7z"
            showUploadList={false}
            beforeUpload={(file) => {
              setUploadFile(file);
              const obsConfig = {
                accessKeyId: 'HPUAIOZNYKEAPWTTMWRJ', // 密钥AK
                bucket: 'userplayer', // 需要上传的桶名
                callbackBodyType: 'application/json', // 响应体格式
                signature: 'w9u3wuq9SEmwbAB7C8gNdoJfjRTRyofFKHS2FCgi', // POST上传的签名
                prefix: 'wz-software-update', // POST上传对象名前缀
                // host: 'obs.cn-north-4.myhuaweicloud.com', // POST上传host地址
                host: 'obs.cn-east-3.myhuaweicloud.com', // POST上传host地址
                callbackUrl: 'http://obs-demo.huaweicloud.com:23450/callback', // POST上传回调的地址
                policy: 'eyJleHBpcmF***************************************ifV19', // POST上传policy
                callbackBody: 'key=$(key)&hash=$(etag)&fname=$(fname)&fsize=$(size)', // POST上传回调的请求体
              };
              const uploadFileFormData = new FormData();
              uploadFileFormData.append('file', file);
              uploadFileFormData.append('key', obsConfig.prefix + '/' + file.name);
              uploadFileFormData.append('x-obs-acl', 'public-read');
              uploadFileFormData.append('policy', obsConfig.policy);
              uploadFileFormData.append('OSSAccessKeyId', obsConfig.accessKeyId);
              uploadFileFormData.append('AccessKeyId', obsConfig.accessKeyId);
              uploadFileFormData.append('signature', obsConfig.signature);
              uploadFileFormData.append('callbackUrl', obsConfig.callbackUrl);
              uploadFileFormData.append('callbackBody', obsConfig.callbackBody);
              uploadFileFormData.append('callbackBodyType', obsConfig.callbackBodyType);

              const obsEndpoint = `https://${obsConfig.bucket}.${obsConfig.host}`;
              uploadToObs(obsEndpoint, uploadFileFormData);
              // 模拟上传进度
              let progress = 0;
              const timer = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                  progress = 100;
                  clearInterval(timer);
                }
                setUploadProgress(Math.round(progress));
              }, 200);
              return false; // 阻止自动上传
            }}
            style={{
              background: uploadFile ? '#f6f8ff' : '#fafafa',
              border: uploadFile ? '2px dashed #1890ff' : '2px dashed #d9d9d9',
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
          >
            {uploadFile ? (
              <div>
                <p style={{ fontSize: 16, color: '#1890ff', margin: '8px 0' }}>
                  <InboxOutlined style={{ fontSize: 24, marginRight: 8 }} />
                  {uploadFile.name}
                </p>
                <p style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>
                  {(uploadFile.size / (1024 * 1024 * 1024)).toFixed(2)}GB
                </p>
                <div style={{ width: '80%', margin: '12px auto' }}>
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        backgroundColor: '#1890ff',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <p
                    style={{ fontSize: 12, color: '#999', margin: '8px 0 0 0', textAlign: 'right' }}
                  >
                    正在上传.....{uploadProgress}%
                  </p>
                </div>
                <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
                  上传时间可能较长，请勿离开此页面
                </p>
              </div>
            ) : (
              <div>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: '#ccc' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: 16, color: '#666' }}>
                  点击上传软件包
                </p>
              </div>
            )}
          </Upload.Dragger>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="软件包类型"
              name="packageType"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="请选择类型">
                <Select.Option value="game">游戏内容包</Select.Option>
                <Select.Option value="system">系统软件包</Select.Option>
                <Select.Option value="plugin">插件包</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="关联游戏"
              name="relatedGame"
              rules={[{ required: true, message: '请选择关联游戏' }]}
            >
              <Select placeholder="请选择">
                {gameList.map((game) => (
                  <Select.Option key={game.value} value={game.value}>
                    {game.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <ProFormText
              label="版本号"
              name="version"
              placeholder="请输入版本号"
              rules={[
                { required: true, message: '请输入版本号' },
                {
                  pattern: /^[0-9]+\.[0-9]+\.[0-9]+$/,
                  message: '请输入正确的版本号格式，如：1.0.0',
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="适用门店"
              name="applicableStores"
              rules={[{ required: true, message: '请至少选择一个适用门店' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择门店"
                style={{ width: '100%' }}
                maxTagCount="responsive"
              >
                {storeList.map((store) => (
                  <Select.Option key={store.value} value={store.value}>
                    {store.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="适用影厅"
              name="applicableCinemas"
              rules={[{ required: true, message: '请至少选择一个适用影厅' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择影厅"
                style={{ width: '100%' }}
                maxTagCount="responsive"
              >
                {cinemaList.map((cinema) => (
                  <Select.Option key={cinema.value} value={cinema.value}>
                    {cinema.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <ProFormTextArea
          label="版本更新公告"
          name="releaseNotes"
          placeholder="请输入版本更新公告"
          fieldProps={{
            rows: 4,
            style: { resize: 'vertical' },
          }}
          rules={[
            { required: true, message: '请输入版本更新公告' },
            { min: 10, message: '版本更新公告至少需要10个字符' },
            { max: 500, message: '版本更新公告不能超过500个字符' },
          ]}
        />
      </ModalForm>

      {/* 部署日志Modal */}
      <Modal
        title="部署日志"
        open={deploymentLogVisible}
        onCancel={() => setDeploymentLogVisible(false)}
        width={800}
        footer={[
          <Button key="confirm" type="primary" onClick={() => setDeploymentLogVisible(false)}>
            确定
          </Button>,
        ]}
      >
        <Table
          dataSource={deploymentLogs}
          pagination={false}
          rowKey="id"
          size="small"
          scroll={{ y: 400 }}
          columns={[
            {
              title: '软件包名',
              dataIndex: 'packageName',
              key: 'packageName',
              width: 200,
              ellipsis: true,
            },
            {
              title: '部署门店',
              dataIndex: 'deployStore',
              key: 'deployStore',
              width: 100,
              align: 'center',
            },
            {
              title: '操作人',
              dataIndex: 'operator',
              key: 'operator',
              width: 80,
              align: 'center',
            },
            {
              title: '操作时间',
              dataIndex: 'operateTime',
              key: 'operateTime',
              width: 140,
              align: 'center',
            },
            {
              title: '部署结果',
              dataIndex: 'deployResult',
              key: 'deployResult',
              width: 120,
              align: 'center',
              render: (text: string, record: any) => (
                <div>
                  <Tag color={record.status === 'success' ? 'success' : 'error'}>{text}</Tag>
                  {record.details && (
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {record.details}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default HeadSetList;
