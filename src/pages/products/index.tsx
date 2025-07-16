// 商品管理页面

import { deleteFile, uploadFile } from '@/services/common';
import {
  deleteProduct,
  getProductList,
  offSaleProduct,
  onSaleProduct,
  saveProduct,
} from '@/services/product';
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
  Divider,
  Form,
  Image,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
  TimePicker,
  Upload,
} from 'antd';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import useStyles from './index.style';

// const updateProductStatus = async (id: string, status: number) => {
//   // TODO: 替换为实际的API调用
//   console.log('更新商品状态', id, status);
//   return true;
// };

// 处理图片上传
// const handleUpload = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   try {
//     // TODO: 替换为实际的上传API
//     console.log('上传图片', formData);
//     return 'https://example.com/placeholder.jpg'; // 模拟返回上传后的URL
//   } catch (error) {
//     message.error('图片上传失败');
//     return '';
//   }
// };

const ProductManagement: React.FC = () => {
  const { styles } = useStyles();
  const tableRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [editingProduct, setEditingProduct] = useState<API.Product | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [timeRanges, setTimeRanges] = useState<API.timeRange[]>([]);
  const [timeRange, setTimeRange] = useState<Omit<API.timeRange, 'showTime'>>({
    beginTime: '',
    endTime: '',
    // showTime: '',
    quantity: 100,
  });
  const [productUrl, setProductUrl] = useState<string>('');
  const [pictures, setPictures] = useState<string[]>([]);
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([]);
  const [pictureFileList, setPictureFileList] = useState<UploadFile[]>([]);
  const [saleDates, setSaleDates] = useState<string[]>([]);
  const [saleTime, setSaleTime] = useState<{
    saleBeginTime?: string;
    saleEndTime?: string;
  }>({
    saleBeginTime: '',
    saleEndTime: '',
  });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // 处理商品状态更新
  const handleOnSaleProduct = async (record: API.Product) => {
    console.log('上架商品', record);
    await onSaleProduct(record.id);
    message.success('上架成功');
    tableRef.current?.reload();
  };

  const handleOffSaleProduct = async (record: API.Product) => {
    console.log('下架商品', record);
    await offSaleProduct(record.id);
    message.success('下架成功');
    tableRef.current?.reload();
  };

  // 删除商品
  const handleDelete = async (record: API.Product) => {
    console.log('删除商品', record);
    await deleteProduct(record.id);
    message.success('删除成功');
    tableRef.current?.reload();
  };

  const saleDateChange = (value: { saleBeginTime?: string; saleEndTime?: string }) => {
    setSaleTime({ ...saleTime, ...value });

    // 新增逻辑：判断并生成日期数组
    const { saleBeginTime, saleEndTime } = value;
    if (saleBeginTime && saleEndTime) {
      const begin = dayjs(saleBeginTime);
      const end = dayjs(saleEndTime);
      if (end.isBefore(begin, 'day')) {
        message.error('结束日期不能早于开始日期');
        setSaleDates([]);
        return;
      }
      // 生成日期数组
      const dates: string[] = [];
      let current = begin.clone();
      while (!current.isAfter(end, 'day')) {
        dates.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
      }
      console.log('dates', dates);
      // 遍历已存在的 timeRanges，通过 showTime 判断是否在 dates 内，如果不在则删除
      if (timeRanges.length > 0) {
        const filteredTimeRanges = timeRanges.filter((item) => dates.includes(item.showTime));
        setTimeRanges(filteredTimeRanges);
      }
      setSaleDates(dates);
      setSelectedDates(dates);
    } else {
      setSaleDates([]);
      setSelectedDates([]);
    }
  };

  // 初始化编辑状态
  const handleEdit = (record: API.Product) => {
    console.log('编辑商品', record);
    setEditingProduct(record);
    setTimeRanges(record.listingList || []);
    const saleDates = Array.from(new Set(record.listingList?.map((item) => item.showTime)));
    if (saleDates.length === 0) {
      saleDateChange({
        saleBeginTime: record.saleBeginTime,
        saleEndTime: record.saleEndTime,
      });
    } else {
      setSaleDates(saleDates || []);
      setSelectedDates(saleDates || []);
    }
    // setSaleDates(saleDates || []);
    // setSelectedDates(saleDates || []);
    setProductUrl(record.productUrl || '');
    setPictures(record.pictureList || []);

    // 设置封面文件列表
    if (record.productUrl) {
      setCoverFileList([
        {
          uid: '-1',
          name: 'cover.jpg',
          status: 'done' as UploadFileStatus,
          url: record.productUrl,
        },
      ]);
    } else {
      setCoverFileList([]);
    }

    // 设置介绍图片文件列表
    if (record.pictureList && record.pictureList.length > 0) {
      setPictureFileList(
        record.pictureList.map((url, index) => ({
          uid: `${record.id}-${index + 1}`,
          name: `picture-${index + 1}.jpg`,
          status: 'done' as UploadFileStatus,
          url,
        })),
      );
    } else {
      setPictureFileList([]);
    }
    setCreateModalVisible(true);
  };

  // 添加时间段
  const addTimeSlot = () => {
    if (timeRange.beginTime === '' || timeRange.endTime === '') {
      message.error('请先选择完整的时间段信息');
      return;
    }
    if (timeRange.beginTime === timeRange.endTime) {
      message.error('开始时间和结束时间不能相同');
      return;
    }
    // 遍历所有选中的 selectedDates
    const listingList: any[] = [];
    selectedDates.forEach((date) => {
      // 先判断当前date是否已存在于timeRanges中（通过showTime字段和时间段）
      const existRanges = timeRanges.filter((tr) => tr.showTime === date);
      const isExist = existRanges.some(
        (tr) => tr.beginTime === timeRange.beginTime && tr.endTime === timeRange.endTime,
      );
      if (isExist) {
        // 已存在则跳过
        return;
      }
      // 不存在则添加
      listingList.push({
        ...timeRange,
        showTime: date,
      });
    });
    // const newTimeRange = { ...timeRange };
    setTimeRanges([...timeRanges, ...listingList]);
    console.log('timeRanges', timeRanges);
    message.success('添加成功');
  };

  // 重置状态
  const resetState = () => {
    setEditingProduct(undefined);
    setTimeRanges([]);
    setSaleDates([]);
    setProductUrl('');
    setPictures([]);
    setCoverFileList([]);
    setPictureFileList([]);
    formRef.current?.resetFields();
  };

  // 处理封面图片上传
  const handleCoverUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('attach', file);

    try {
      const res = await uploadFile(formData, {
        projectName: 'products',
      });

      if (res && res.allUrl) {
        setProductUrl(res.allUrl);
        setCoverFileList([
          {
            uid: '-1',
            name: file.name,
            status: 'done' as UploadFileStatus,
            url: res.allUrl,
          },
        ]);
        message.success('封面上传成功');
        return res.allUrl;
      } else {
        message.error('封面上传失败');
        return '';
      }
    } catch (error) {
      console.error('上传出错', error);
      message.error('封面上传失败');
      return '';
    }
  };

  // 处理介绍图片上传
  const handlePictureUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('attach', file);

    try {
      const res = await uploadFile(formData, {
        projectName: 'products',
      });

      if (res && res.allUrl) {
        const newPictures = [...pictures, res.allUrl];
        setPictures(newPictures);

        // 更新文件列表
        const newFile = {
          uid: `-${pictureFileList.length + 1}`,
          name: file.name,
          status: 'done' as UploadFileStatus,
          url: res.allUrl,
        };
        setPictureFileList([...pictureFileList, newFile]);

        message.success('介绍图片上传成功');
        return res.allUrl;
      } else {
        message.error('介绍图片上传失败');
        return '';
      }
    } catch (error) {
      console.error('上传出错', error);
      message.error('介绍图片上传失败');
      return '';
    }
  };

  // 处理封面删除
  const handleCoverRemove = async (file: UploadFile) => {
    if (file.url) {
      try {
        await deleteFile(file.url);
        setProductUrl('');
        setCoverFileList([]);
        message.success('封面删除成功');
      } catch (error) {
        console.error('删除失败', error);
        message.error('封面删除失败');
      }
    }
    return true;
  };

  // 处理介绍图片删除
  const handlePictureRemove = async (file: UploadFile) => {
    if (file.url) {
      try {
        await deleteFile(file.url);
        const newPictures = pictures.filter((url) => url !== file.url);
        setPictures(newPictures);

        const newFileList = pictureFileList.filter((item) => item.url !== file.url);
        setPictureFileList(newFileList);

        message.success('介绍图片删除成功');
      } catch (error) {
        console.error('删除失败', error);
        message.error('介绍图片删除失败');
      }
    }
    return true;
  };

  const handleTagClick = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };
  const saveProductData = async (values: API.Product) => {
    console.log('listingList', timeRanges);
    // debugger;
    await saveProduct(values, timeRanges);
    console.log('保存商品', values);
    return true;
  };
  const columns: ProColumns<API.Product>[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: '商品封面',
      dataIndex: 'productUrl',
      width: 120,
      search: false,
      render: (_, record) => <Image src={record.productUrl} width={50} />,
    },
    {
      title: '商品图片',
      dataIndex: 'pictureList',
      width: 200,
      search: false,
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {record.pictureList &&
            record.pictureList.length > 0 &&
            record.pictureList.map((pic, index) => (
              <Image
                key={index}
                src={pic}
                width={50}
                style={{ display: 'flex', alignItems: 'center' }}
              />
            ))}
        </div>
      ),
    },
    {
      title: '商品简介',
      dataIndex: 'summaries',
      // ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: '销售状态',
      dataIndex: 'saleStatus',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.saleStatus === 1 ? 'success' : 'default'}>
          {record.saleStatus === 1 ? '已上架' : '已下架'}
        </Tag>
      ),
    },
    {
      title: '放映时长',
      dataIndex: 'showTime',
      search: false,
      width: 80,
    },
    {
      title: '销售开始时间',
      dataIndex: 'saleBeginTime',
      width: 100,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '销售结束时间',
      dataIndex: 'saleEndTime',
      width: 100,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          {record.saleStatus === 0 ? (
            <Button type="link" onClick={() => handleOnSaleProduct(record)}>
              上架
            </Button>
          ) : (
            <Button type="link" onClick={() => handleOffSaleProduct(record)}>
              下架
            </Button>
          )}
          <Button key="edit" type="link" onClick={() => handleEdit(record)}>
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

  return (
    <>
      <ProTable<API.Product>
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const _params = {
            pageSize: params.pageSize,
            pageNum: params.current,
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
              resetState();
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增商品
          </Button>,
        ]}
      />

      <ModalForm<API.Product>
        title={editingProduct ? '编辑商品' : '新增商品'}
        width={1200}
        formRef={formRef}
        open={createModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            resetState();
          }
          setCreateModalVisible(visible);
        }}
        initialValues={editingProduct}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          afterClose: () => {
            resetState();
          },
        }}
        onFinish={async (values) => {
          try {
            const submitData: API.Product = {
              ...values,
              id: editingProduct?.id || '',
              productUrl,
              pictureList: pictures,
            };

            await saveProductData(submitData);
            message.success('提交成功');
            tableRef.current?.reload();
            setCreateModalVisible(false);
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
              fieldProps={{
                onChange: (value: any) => {
                  console.log('销售开始时间', value);
                  if (value) {
                    saleDateChange({
                      saleBeginTime: dayjs(value).format('YYYY-MM-DD'),
                      saleEndTime: saleTime.saleEndTime,
                    });
                  }
                },
              }}
              rules={[{ required: true, message: '请选择销售开始时间' }]}
            />
          </Col>
          <Col span={6}>
            <ProFormDateTimePicker
              name="saleEndTime"
              label="销售结束时间"
              fieldProps={{
                onChange: (value: any) => {
                  console.log('销售结束时间', value);
                  if (value) {
                    saleDateChange({
                      saleBeginTime: saleTime.saleBeginTime,
                      saleEndTime: dayjs(value).format('YYYY-MM-DD'),
                    });
                  }
                },
              }}
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
          <Col span={6}>
            <Form.Item
              label="商品封面"
              name="productUrl"
              rules={[{ required: !productUrl, message: '请上传商品封面' }]}
            >
              <Upload
                listType="picture-card"
                fileList={coverFileList}
                maxCount={1}
                onRemove={handleCoverRemove}
                onPreview={(file) => {
                  if (file.url) {
                    window.open(file.url, '_blank');
                  }
                }}
                beforeUpload={async (file) => {
                  await handleCoverUpload(file);
                  return false; // 阻止自动上传
                }}
              >
                {coverFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传封面</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label="商品介绍图片" name="pictureList">
              <Upload
                listType="picture-card"
                fileList={pictureFileList}
                maxCount={5}
                onRemove={handlePictureRemove}
                onPreview={(file) => {
                  if (file.url) {
                    window.open(file.url, '_blank');
                  }
                }}
                beforeUpload={async (file) => {
                  if (pictureFileList.length >= 5) {
                    message.error('最多上传5张介绍图片');
                    return false;
                  }
                  await handlePictureUpload(file);
                  return false; // 阻止自动上传
                }}
              >
                {pictureFileList.length < 5 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传介绍图</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <div style={{ marginBottom: 20, fontSize: 16, fontWeight: 500 }}>添加场次</div>
        <div>
          {saleDates.map((date) => (
            <Tag
              style={{ marginBottom: 10, cursor: 'pointer' }}
              key={date}
              color={selectedDates.includes(date) ? 'blue' : 'default'}
              onClick={() => handleTagClick(date)}
            >
              {date}
            </Tag>
          ))}
        </div>

        <Row gutter={24}>
          <InputNumber
            style={{ width: 200 }}
            type="number"
            placeholder="可播放数量"
            value={timeRange.quantity}
            max={1000}
            onChange={(value) => {
              if (value) {
                setTimeRange({ ...timeRange, quantity: value });
              }
            }}
            addonAfter="个"
            addonBefore="可播放数量"
          />
          {/* <DatePicker
            style={{ marginLeft: 20 }}
            format={{
              format: 'YYYY-MM-DD',
              type: 'mask',
            }}
            onChange={(time) => {
              console.log('time', time);
              const date = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
              setTimeRange({ ...timeRange, showTime: date });
            }}
          /> */}
          <TimePicker.RangePicker
            style={{ marginLeft: 20 }}
            onChange={(time) => {
              if (time && time.length === 2) {
                const beginTime = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss');
                const endTime = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss');
                setTimeRange({ ...timeRange, beginTime, endTime });
              } else {
                setTimeRange({ ...timeRange, beginTime: '', endTime: '' });
              }
            }}
            name="timeRange"
            format="HH:mm"
            disabledTime={() => ({
              disabledHours: () => {
                // 禁用0-8点和23点之后
                const hours = [];
                for (let i = 0; i < 9; i++) hours.push(i); // 0~8
                for (let i = 23; i < 24; i++) hours.push(i); // 23
                return hours;
              },
            })}
          />
          <Button
            style={{ marginLeft: 20 }}
            disabled={timeRange.beginTime === '' || timeRange.endTime === ''}
            type="primary"
            onClick={() => addTimeSlot()}
          >
            添加
          </Button>
        </Row>

        {/* 日期分组，每行4个 */}
        {(() => {
          type TimeRangeWithShowTime = (typeof timeRanges)[number] & { showTime: string };
          // 按日期分组
          const grouped: Record<string, TimeRangeWithShowTime[]> = (
            timeRanges as TimeRangeWithShowTime[]
          ).reduce(
            (acc, cur) => {
              if (!acc[cur.showTime]) acc[cur.showTime] = [];
              acc[cur.showTime].push(cur);
              return acc;
            },
            {} as Record<string, TimeRangeWithShowTime[]>,
          );
          // 分组转为数组，便于分行
          const groupArr = Object.entries(grouped).sort(
            ([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
          );
          const rows = [];
          for (let i = 0; i < groupArr.length; i += 4) {
            rows.push(groupArr.slice(i, i + 4));
          }
          return (
            <div style={{ marginBottom: 16 }}>
              {rows.map((row, rowIdx) => (
                <div key={rowIdx + 'row'} style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                  {row.map(([date, ranges]) => (
                    <div
                      key={date + rowIdx}
                      className={styles.dateBox}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                        {date}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 8,
                          justifyContent: 'space-around',
                        }}
                      >
                        {ranges.map((range, idx) => (
                          <Tag
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              display: 'block',
                              textAlign: 'center',
                            }}
                            key={`${date}-${idx}`}
                            closable
                            color="green"
                            onClose={() => {
                              // 删除逻辑
                              const newRanges = (timeRanges as TimeRangeWithShowTime[]).filter(
                                (item, i) =>
                                  !(
                                    item.showTime === date &&
                                    i ===
                                      (timeRanges as TimeRangeWithShowTime[]).findIndex(
                                        (t) =>
                                          t.showTime === date &&
                                          t.beginTime === range.beginTime &&
                                          t.endTime === range.endTime,
                                      )
                                  ),
                              );
                              setTimeRanges(newRanges);
                            }}
                          >
                            {dayjs(range.beginTime).format('HH:mm')}-
                            {dayjs(range.endTime).format('HH:mm')}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}
      </ModalForm>
    </>
  );
};

export default ProductManagement;
