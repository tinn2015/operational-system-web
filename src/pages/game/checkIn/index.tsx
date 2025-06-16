// 签到页面
import { getPlayerCheckinCode } from '@/services/checkIn';
import { getRecentProducts } from '@/services/product';
import { Button, Card, Form, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const CheckInPage = () => {
  const [productList, setProductList] = useState<API.Product[]>([]);
  const [sessionList, setSessionList] = useState<API.timeRange[]>([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedSession, setSelectedSession] = useState();
  const [quantity, setQuantity] = useState(1);
  const [playerId, setPlayerId] = useState('');

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
    setSessionList(product?.listingList || []);
  };

  // 提交签到
  const handleFinish = async (values: {
    productId: string;
    sessionId: string;
    quantity: number;
  }) => {
    console.log(values);
    const res = await getPlayerCheckinCode({
      productId: values.productId,
      sessionId: values.sessionId,
      quantity: values.quantity,
    });
    console.log('提交签到', res);
  };

  const [form] = Form.useForm();

  return (
    <Card title="玩家签到">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
          <Form form={form} layout="vertical" onFinish={handleFinish} style={{ width: '400px' }}>
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
              name="sessionId"
              label="选择场次"
              rules={[{ required: true, message: '请选择场次' }]}
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
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
        >
          <Card title="腕带信息预览">
            <div>
              <div>玩家ID</div>
              <div>1234567890</div>
            </div>
          </Card>
        </div>
      </div>
      {/* {playerId && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <div>玩家ID二维码：</div>
          <QRCode value={playerId} size={200} />
        </div>
      )} */}
    </Card>
  );
};

export default CheckInPage;
