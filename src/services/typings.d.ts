declare namespace API {
  type Headset = {
    id: number;
    // 头显编码
    headsetNo: string;
    // 头显ip
    headsetIp: string;
    // 网络类型
    networkType: number;
    // 头显类型 1：头显、2：一体机
    headsetType: number;
    // 头显状态
    headsetStatus: number;
    // 串流状态，0：停止，1正常，2未知
    status: number;
    // 剩余电量
    remainElectricity: number;
  };
  type HeadsetList = {
    total: number;
    pageSize: number;
    pageNum: number;
    data: Headset[];
  };

  type Device = {
    id: string;
    /** ServerType 枚举说明
     * 1: 串流服务器
     * 2: 游戏client
     * 3: 游戏server
     * 4: 位姿总服务器
     * 5: 位姿子服务器
     */
    serverType: 1 | 2 | 3 | 4 | 5;
    serverIp: string;
    /** serverStatus 枚举说明
     * 0: 停止
     * 1: 正常
     * 2: 未知
     */
    agentStatus: 0 | 1 | 2;
    /** onlineStatus 枚举说明
     * 0: 离线
     * 1: 在线
     * 2: 未知
     */
    onlineStatus: 0 | 1 | 2;
    agentTime: string;
  };

  type DeviceList = {
    total: number;
    pageSize: number;
    pageNum: number;
    data: Device[];
  };

  type LoginParams = {
    loginId: string;
    password: string;
  };

  type LoginResult = {
    token: string;
    refreshToken: string;
    VerificationCode?: string;
    failureCount?: number;
  };

  type UserRole = 1 | 2 | 3; // 1: 管理员, 2: 普通用户, 3: 访客

  type User = {
    id: number;
    // 用户名
    userName: string;
    // 用户编码
    userId: string;
    // 真实姓名
    realName: string;
    // 手机号
    phone: string;
    // 邮箱
    email: string;
    // 角色
    role: UserRole;
    // 状态 1: 启用, 0: 禁用
    status: 0 | 1;
    // 创建时间
    createTime: string;
  };

  type UserList = {
    total: number;
    pageSize: number;
    pageNum: number;
    data: User[];
  };

  // 商品类型定义
  type Product = {
    id: string;
    productName: string;
    productUrl: string; // 用于存储封面图片URL
    pictures: string[];
    information: string;
    summaries: string;
    saleStatus: number; // 0: 下架, 1: 上架
    showTime: string;
    saleBeginTime: string;
    saleEndTime: string;
  };
  type timeRange = { beginTime: number; endTime: number };
}
