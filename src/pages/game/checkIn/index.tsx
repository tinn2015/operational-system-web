// 签到页面
import { getPlayerCheckinCode } from '@/services/checkIn';
import { getRecentProducts } from '@/services/product';
import usePrint from '@/utils/printHook';
import { createBatchPrintData } from '@/utils/printHook/printData/Batch';
import { CheckCircleTwoTone } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  QRCode,
  Row,
  Select,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useStyles from './index.style';

const CheckInPage = () => {
  const [productList, setProductList] = useState<API.Product[]>([]);
  const [sessionList, setSessionList] = useState<API.timeRange[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<API.Product>();
  const [selectedListing, setSelectedListing] = useState<API.timeRange>();
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const { styles } = useStyles();

  // 打印hook
  const { printInit, logic } = usePrint();

  // 获取商品列表setUsbSelectPrinter
  useEffect(() => {
    getRecentProducts().then((res) => {
      console.log(res);
      setProductList(res);
    });
  }, []);
  useEffect(() => {
    const initPrint = async () => {
      if (logic?.printSocketOpen) {
        const usbPrinterId = localStorage.getItem('usbPrinterId');
        console.log('usbPrinterId', usbPrinterId);
        if (usbPrinterId) {
          // 更新打印机列表
          const res = await logic?.getPrinters();
          if (res) {
            alert(res);
            return;
          }
          // 选择默认打印机
          logic?.setUsbSelectPrinter(usbPrinterId);
          // 连接打印机
          await logic?.selectOnLineUsbPrinter();
          // 初始化打印机
          logic?.init();
          // 设置标签类型
          // 标签类型选项:
          // 1: 间隙纸
          // 2: 黑标纸
          // 3: 连续纸
          // 4: 过孔纸
          // 5: 透明纸
          // 6: 标牌
          // 10: 黑标间隙纸
          logic?.setLabelType('2');
          // 打印模式选项:
          // 1: 热敏打印
          // 2: 热转印打印
          logic?.setPrintMode('1');
          // logic?.setAutoShutDown('1');
        }
      }
    };
    initPrint();
  }, [logic?.printSocketOpen]);

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
    console.log('选择场次', listing);
    setSelectedListing(listing);
  };

  // 提交签到
  const handleFinish = async (values: {
    productId: string;
    listingId: string;
    quantity: number;
  }) => {
    console.log(values);
    setLoading(true);
    try {
      const res = await getPlayerCheckinCode({
        productId: values.productId,
        listingId: values.listingId,
        quantity: values.quantity,
      });
      console.log('提交签到', res);
      setPlayerIds(res);
    } finally {
      setLoading(false);
    }
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
  const handleBatchPrint = async () => {
    setPrintLoading(true);
    const printData = createBatchPrintData(
      selectedIds,
      selectedProduct?.productName || '',
      selectedListing?.beginTime || '',
      selectedListing?.endTime || '',
    );
    console.log('打印数据', printData);
    await logic?.startBatchPrintJobTest(printData);
    setTimeout(() => {
      setPrintLoading(false);
    }, selectedIds.length * 1000);
  };

  const handlePrinterChange = (value: string) => {
    console.log('选择打印机', value);
    localStorage.setItem('usbPrinterId', value);
    logic?.setUsbSelectPrinter(value);
  };

  const [form] = Form.useForm();

  return (
    <div>
      <Card title="打印机连接">
        <Row gutter={20}>
          <Col span={8}>
            打印服务状态：{logic?.printSocketOpen ? '已连接' : '未连接（需要提前安装打印服务）'}
            <CheckCircleTwoTone twoToneColor={logic?.printSocketOpen ? '#52c41a' : '#ff4d4f'} />
          </Col>
          <Col span={8}>
            选择usb打印机：
            <Select
              placeholder="请选择usb打印机"
              style={{ width: '40%' }}
              value={localStorage.getItem('usbPrinterId')}
              options={Object.keys(logic?.usbPrinters || {}).map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={handlePrinterChange}
            />
            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => logic?.getPrinters()}>
              更新打印机列表
            </Button>
          </Col>
          <Col span={8}>
            {!logic?.onlineUsbBool ? (
              <Button type="primary" onClick={() => logic?.selectOnLineUsbPrinter()}>
                连接打印机
              </Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleTwoTone twoToneColor="#52c41a" />
                打印机已连接
              </div>
            )}
            {!logic?.onlineUsbBool ? (
              <Button type="primary" style={{ marginLeft: 10 }} onClick={printInit}>
                初始化打印机
              </Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleTwoTone twoToneColor="#52c41a" />
                打印机初始化成功
              </div>
            )}
          </Col>
        </Row>
      </Card>
      <Card title="玩家签到" className={styles.mt20}>
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
              >
                <Select
                  placeholder="请选择场次"
                  notFoundContent="今日暂无场次"
                  onChange={handleSessionChange}
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  签到
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Divider type="vertical" style={{ height: '100%' }} />
          <div
            className={styles.qrCodeBox}
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
                <Button
                  type="primary"
                  onClick={handleBatchPrint}
                  disabled={selectedIds.length === 0}
                  loading={printLoading}
                >
                  批量打印 ({selectedIds.length})
                </Button>
              </div>
            )}
            {playerIds.map((item) => (
              <div key={item} className={styles.previewBox}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectedIds.includes(item)}
                    onChange={(e) => handleSelectChange(item, e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  <QRCode value={String(item)} size={120} level="H" bordered={false} />
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
                  <Button type="primary" loading={printLoading} onClick={() => handleBatchPrint()}>
                    打印
                  </Button>
                </Space>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CheckInPage;
