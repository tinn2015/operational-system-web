// 签到页面
import { getPlayerCheckinCode } from '@/services/checkIn';
import { getRecentProducts } from '@/services/product';
import { Button, Card, Checkbox, Divider, Form, InputNumber, QRCode, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './index.less';
const CheckInPage = () => {
  const [productList, setProductList] = useState<API.Product[]>([]);
  const [sessionList, setSessionList] = useState<API.timeRange[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<API.Product>();
  const [selectedListing, setSelectedListing] = useState<API.timeRange>();
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 获取商品列表
  useEffect(() => {
    // TODO: 替换为实际接口
    getRecentProducts().then((res) => {
      console.log(res);
      setProductList(res);
    });
  }, []);

  // 选择商品后获取场次
  const handleProductChange = (productId: string) => {
    // setSelectedProduct(productId);
    const product = productList.find((item) => item.id === productId);
    console.log(product);
    setSelectedProduct(product);
    setSessionList(product?.listingList || []);
  };

  const handleSessionChange = (listingId: string) => {
    const listing = sessionList.find((item) => item.id === listingId);
    console.log(listing);
    setSelectedListing(listing);
  };

  // 提交签到
  const handleFinish = async (values: {
    productId: string;
    listingId: string;
    quantity: number;
  }) => {
    console.log(values);
    const res = await getPlayerCheckinCode({
      productId: values.productId,
      listingId: values.listingId,
      quantity: values.quantity,
    });
    console.log('提交签到', res);
    setPlayerIds(res);
  };

  // 处理选择变化
  const handleSelectChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(playerIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 批量打印
  const handleBatchPrint = () => {
    selectedIds.forEach((id) => {
      handlePrint(id);
    });
  };

  const [form] = Form.useForm();

  return (
    <Card title="玩家签到">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish} style={{ width: '500px' }}>
            <Form.Item
              name="productId"
              label="选择商品"
              rules={[{ required: true, message: '请选择商品' }]}
            >
              <Select
                placeholder="请选择商品"
                options={productList.map((item) => ({
                  label: item.productName,
                  value: item.id,
                }))}
                onChange={handleProductChange}
              />
            </Form.Item>
            <Form.Item
              name="listingId"
              label="选择场次"
              rules={[{ required: true, message: '请选择场次' }]}
              onChange={handleSessionChange}
            >
              <Select
                placeholder="请选择场次"
                notFoundContent="今日暂无场次"
                options={sessionList.map((item) => ({
                  label: `${dayjs(item.beginTime).format('HH:mm')} - ${dayjs(item.endTime).format('HH:mm')}`,
                  value: item.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="玩家数量"
              initialValue={1}
              rules={[{ required: true, message: '请输入数量' }]}
            >
              <InputNumber min={1} max={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                签到
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Divider type="vertical" style={{ height: '100%' }} />
        <div
          style={{
            display: 'flex',
            // justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          {playerIds.length > 0 && (
            <div
              style={{
                width: '80%',
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Checkbox
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedIds.length === playerIds.length}
              >
                全选
              </Checkbox>
              <Button type="primary" onClick={handleBatchPrint} disabled={selectedIds.length === 0}>
                批量打印 ({selectedIds.length})
              </Button>
            </div>
          )}
          {playerIds.map((item) => (
            <div
              key={item}
              className="previewBox"
              style={{
                margin: 10,
                display: 'flex',
                alignItems: 'center',
                width: '50%',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: 16,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selectedIds.includes(item)}
                  onChange={(e) => handleSelectChange(item, e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                <QRCode value={item} size={100} />
                <div
                  style={{
                    marginLeft: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '80px',
                  }}
                >
                  <div>{selectedProduct?.productName}</div>
                  <div>
                    {dayjs(selectedListing?.beginTime).format('HH:mm')} -{' '}
                    {dayjs(selectedListing?.endTime).format('HH:mm')}
                  </div>
                  <div>吾知科技</div>
                </div>
              </div>
              <Space>
                <Button type="primary" onClick={() => handlePrint(item)}>
                  打印
                </Button>
              </Space>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CheckInPage;
