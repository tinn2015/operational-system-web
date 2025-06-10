// 商品管理页面

import { getProductList, saveProduct } from '@/services/product';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
  TimePicker,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

// 表单值类型
type ProductFormValues = Omit<API.Product, 'productUrl'> & {
  productUrl?: UploadFile[];
};

const saveProductData = async (values: API.Product, timeRanges: API.timeRange[]) => {
  await saveProduct(values, timeRanges);
  console.log('保存商品', values);
  return true;
};

const deleteProduct = async (id: string) => {
  // TODO: 替换为实际的API调用
  console.log('删除商品', id);
  return true;
};

const updateProductStatus = async (id: string, status: number) => {
  // TODO: 替换为实际的API调用
  console.log('更新商品状态', id, status);
  return true;
};

// 处理图片上传
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    // TODO: 替换为实际的上传API
    console.log('上传图片', formData);
    return 'https://example.com/placeholder.jpg'; // 模拟返回上传后的URL
  } catch (error) {
    message.error('图片上传失败');
    return '';
  }
};

const ProductManagement: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [editingProduct, setEditingProduct] = useState<API.Product | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [timeRanges, setTimeRanges] = useState<API.timeRange[]>([]);
  const [timeRange, setTimeRange] = useState<API.timeRange>({
    beginTime: 0,
    endTime: 0,
    showTime: 0,
    quantity: 100,
  });

  // 处理商品状态更新
  const handleStatusChange = async (record: API.Product, newStatus: number) => {
    try {
      await updateProductStatus(record.id, newStatus);
      message.success(newStatus === 1 ? '上架成功' : '下架成功');
      tableRef.current?.reload();
    } catch (error) {
      message.error(newStatus === 1 ? '上架失败' : '下架失败');
    }
  };

  // 处理商品删除
  const handleDelete = async (record: API.Product) => {
    try {
      await deleteProduct(record.id);
      message.success('删除成功');
      tableRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<API.Product>[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '商品封面',
      dataIndex: 'productUrl',
      width: 120,
      render: (_, record) => (
        <img
          src={record.productUrl}
          alt={record.productName}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '商品图片',
      dataIndex: 'pictures',
      width: 120,
      render: (_, record) => (
        <img
          src={record.pictures[0]}
          alt={record.productName}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '商品简介',
      dataIndex: 'summaries',
      ellipsis: true,
      width: 200,
    },
    {
      title: '销售状态',
      dataIndex: 'saleStatus',
      width: 100,
      render: (_, record) => (
        <Tag color={record.saleStatus === 1 ? 'success' : 'default'}>
          {record.saleStatus === 1 ? '已上架' : '已下架'}
        </Tag>
      ),
    },
    {
      title: '展示时间',
      dataIndex: 'showTime',
      width: 180,
    },
    {
      title: '销售开始时间',
      dataIndex: 'saleBeginTime',
      width: 180,
    },
    {
      title: '销售结束时间',
      dataIndex: 'saleEndTime',
      width: 180,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          {record.saleStatus === 0 ? (
            <Button type="link" onClick={() => handleStatusChange(record, 1)}>
              上架
            </Button>
          ) : (
            <Button type="link" onClick={() => handleStatusChange(record, 0)}>
              下架
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              setEditingProduct(record);
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该商品吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const addTimeSlot = () => {
    // 获取时间范围并添加到列表
    if (timeRange.beginTime !== 0 && timeRange.endTime !== 0) {
      // 检查时间段是否已存在
      const timeExists = timeRanges.some(
        (range) => range.beginTime === timeRange.beginTime && range.endTime === timeRange.endTime,
      );

      if (timeExists) {
        message.error('该场次时间段已存在');
      } else {
        setTimeRanges([timeRange, ...timeRanges]);
        setTimeRange({ beginTime: 0, endTime: 0, showTime: 0, quantity: 100 });
      }
    } else {
      message.error('请选择时间范围');
    }
  };

  return (
    <>
      <ProTable<API.Product>
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          const _params = {
            pageSize: params.pageSize,
            pageIndex: params.current,
            ...params,
          };
          delete _params.current;
          const productList = await getProductList(_params);
          console.log('productList', productList);
          return {
            data: productList.items,
            success: true,
            total: productList.count,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        headerTitle="商品管理"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setEditingProduct(undefined);
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增商品
          </Button>,
        ]}
      />

      <ModalForm<ProductFormValues>
        title={editingProduct ? '编辑商品' : '新增商品'}
        width={1200}
        formRef={formRef}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        initialValues={
          editingProduct
            ? {
                ...editingProduct,
                productUrl: editingProduct.productUrl
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: editingProduct.productUrl,
                      },
                    ]
                  : undefined,
              }
            : undefined
        }
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          afterClose: () => {
            setEditingProduct(undefined);
            formRef.current?.resetFields();
          },
        }}
        onFinish={async (values) => {
          try {
            let productUrl = '';
            if (values.productUrl?.[0]?.originFileObj) {
              productUrl = await handleUpload(values.productUrl[0].originFileObj);
            } else if (values.productUrl?.[0]?.url) {
              productUrl = values.productUrl[0].url;
            }

            const submitData: API.Product = {
              ...values,
              id: editingProduct?.id || '',
              productUrl,
            };

            await saveProductData(submitData, timeRanges);
            message.success('提交成功');
            tableRef.current?.reload();
            return true;
          } catch (error) {
            message.error('提交失败');
            return false;
          }
        }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <ProFormText
              name="productName"
              label="商品名称"
              placeholder="请输入商品名称"
              rules={[{ required: true, message: '请输入商品名称' }]}
            />
          </Col>
          <Col span={6}>
            <ProFormDigit
              name="showTime"
              label="放映时长（分钟）"
              min={10}
              max={1000}
              fieldProps={{
                precision: 0,
              }}
              rules={[{ required: true, message: '请输入放映时长' }]}
            />
          </Col>
          <Col span={6}>
            <ProFormDateTimePicker
              name="saleBeginTime"
              label="销售开始时间"
              rules={[{ required: true, message: '请选择销售开始时间' }]}
            />
          </Col>
          <Col span={6}>
            <ProFormDateTimePicker
              name="saleEndTime"
              label="销售结束时间"
              rules={[{ required: true, message: '请选择销售结束时间' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormTextArea
              name="summaries"
              label="商品简介"
              placeholder="请输入商品简介"
              rules={[{ required: true, message: '请输入商品简介' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormTextArea
              name="information"
              label="商品详情"
              placeholder="请输入商品详情"
              rules={[{ required: true, message: '请输入商品详情' }]}
            />
          </Col>
          {/* <Col span={6}>
            <ProFormUploadButton
              name="productUrl"
              width={100}
              label="商品封面"
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                maxCount: 1,
              }}
              rules={[{ required: true, message: '请上传商品封面' }]}
            />
          </Col>
          <Col span={18}>
            <ProFormUploadButton
              width={60}
              name="pictures"
              label="商品图片"
              max={5}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                multiple: true,
              }}
              rules={[{ required: true, message: '请上传商品图片' }]}
            />
          </Col> */}
        </Row>
        <Divider />
        <div style={{ marginBottom: 20, fontSize: 16, fontWeight: 500 }}>添加场次</div>
        <Row gutter={24}>
          <InputNumber
            style={{ width: 200 }}
            type="number"
            placeholder="可播放数量"
            value={timeRange.quantity}
            onChange={(value) => {
              setTimeRange({ ...timeRange, quantity: value || 100 });
            }}
            addonAfter="个"
            addonBefore="可播放数量"
          />
          <DatePicker
            format={{
              format: 'YYYY-MM-DD',
              type: 'mask',
            }}
            onChange={(time) => {
              console.log('time', time);
              const date = dayjs(time).valueOf();
              setTimeRange({ ...timeRange, showTime: date });
            }}
          />
          <TimePicker.RangePicker
            style={{ marginLeft: 20 }}
            onChange={(time) => {
              if (time && time.length === 2) {
                const beginTime = dayjs(time[0]).valueOf();
                const endTime = dayjs(time[1]).valueOf();
                setTimeRange({ ...timeRange, beginTime, endTime });
              } else {
                setTimeRange({ ...timeRange, beginTime: 0, endTime: 0 });
              }
            }}
            name="timeRange"
            format="HH:mm"
          />
          <Button
            style={{ marginLeft: 20 }}
            disabled={timeRange.beginTime === 0 || timeRange.endTime === 0}
            type="primary"
            onClick={() => addTimeSlot()}
          >
            添加
          </Button>
        </Row>

        {timeRanges.length > 0 && (
          <Space style={{ marginTop: 20 }}>
            {timeRanges.map((range, index) => (
              <Tag
                key={index}
                closable
                color="green"
                onClose={() => {
                  const newRanges = [...timeRanges];
                  newRanges.splice(index, 1);
                  setTimeRanges(newRanges);
                }}
              >
                {dayjs(range.showTime).format('YYYY-MM-DD') + ' '}
                {dayjs(range.beginTime).format('HH:mm')}-{dayjs(range.endTime).format('HH:mm')}
              </Tag>
            ))}
          </Space>
        )}
      </ModalForm>
    </>
  );
};

export default ProductManagement;
