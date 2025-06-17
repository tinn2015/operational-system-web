/**
 * @Description
 * @Version
 * @Author  徐泽鹏
 * @date 2023/5/23 11:49
 */

interface SocketOptions {
  resetTime: number;
  timeout: number;
}

interface PromisePoolItem {
  timestamp: number;
  content: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timeoutCallback: ReturnType<typeof setTimeout>;
}

export default class Socket {
  // 是否在处理提交数据默认状态，默认已处理
  public isProcessingCommitJob: boolean = false;
  // 当前websocket的url
  public url: string;
  // 重连时间配置，超时时间配置
  public options: SocketOptions = { resetTime: 3000, timeout: 10000 };
  // 是否自动关闭
  public customClose: boolean = false;
  // promise存储池
  private promisePool: { [key: string]: PromisePoolItem } = {};
  // websocket实例
  private _websocket: WebSocket | undefined;
  // 添加打印监听回调存储
  public printListeners: Set<(msg: any) => void> = new Set();
  // 保存回调函数的引用
  private openChangeCallback: ((isOpen: boolean) => void) | null = null;

  constructor(options: Partial<SocketOptions> = {}) {
    this.url = "ws://127.0.0.1:37989";
    this.options = { ...this.options, ...options };
  }

  // 判断返回数据是否json数据
  private isJSON(str: any): any | boolean {
    if (typeof str === "string") {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  // 关闭回调处理
  private closeCallback(): void {
    if (!this.customClose) {
      this.isProcessingCommitJob = false; // 重置提交状态
      this.close(false);
      this._websocket = undefined;
      this.printListeners.clear(); // 清理所有回调
      const timer = setTimeout(async () => {
        try {
          await this.open(this.openChangeCallback || undefined, undefined);
          clearTimeout(timer);
        } catch (error) {
          console.error("重连失败:", error);
          if (this.openChangeCallback) {
            this.openChangeCallback(false);
          }
        }
      }, this.options.resetTime);
      this.customClose = false;
    }
  }

  /**
   * 打开 WebSocket 连接并返回一个解析为 WebSocket 实例的 Promise。
   *
   * @param {function} openChange - WebSocket 连接打开时要调用的回调函数。
   * @param {function} onMessageCallback - 接收到消息时要调用的回调函数。
   * @return {Promise} 一个解析为 WebSocket 实例的 Promise。
   */
  public open(openChange?: (isOpen: boolean) => void, onMessageCallback?: (msg: any) => void): Promise<{ e: Event, ws: Socket }> {
    if (openChange) {
      this.openChangeCallback = openChange;
    }
    return new Promise((resolve) => {
      if (typeof this._websocket === "undefined") {
        this._websocket = new WebSocket(this.url);
        this._websocket.onopen = (e: Event) => {
          console.log(openChange, "open---openChange");
          if (openChange) {
            openChange(true);
          }
          resolve({ e, ws: this });
        };
        this._websocket.onerror = () => {
          if (openChange) {
            openChange(false);
          }
          this.isProcessingCommitJob = false; // 异常时重置状态
          this.closeCallback();
        };
        this._websocket.onclose = () => {
          if (openChange) {
            openChange(false);
          }
          this.printListeners.clear();
          this.closeCallback();
        };
        this._websocket.onmessage = (e: MessageEvent) => {
          const msg = this.isJSON(e.data) ? JSON.parse(e.data as string) : e.data;
          // 新增消息分类路由
          // console.log( "niimbot-msg",msg);
          this.messageRouter(msg, onMessageCallback);
        };
      }
    });
  }

  /**
   * 消息路由核心方法
   * 功能：根据消息特征将消息分为三类处理
   * 1. API响应消息（匹配apiName字段）
   * 2. 设备主动上报事件（匹配resultAck.callback结构）
   * 3. 统一回调处理（兜底处理所有消息）
   */
  private messageRouter(msg: any, onMessageCallback?: (msg: any) => void): void {
    // console.log( "niimbot-msg",msg.apiName);
    
    // 白名单机制处理主动上报消息
    const isAutoReport = msg.apiName === 'commitJob';
    
    if (msg.apiName && msg.apiName !== 'getPrinterHighLevelInfo' && msg.apiName !== 'printStatus' && !isAutoReport) { // 处理普通API响应
      this.handleApiResponse(msg);
    } else if (isAutoReport) { // 处理设备主动上报
      this.handleEventPush(msg); 
    }
    if (msg.apiName === 'getPrinterHighLevelInfo' || msg.apiName === 'printStatus') { // Corrected logic here
      onMessageCallback && onMessageCallback(msg); // 统一回调处理设备状态上报
    }    
  }

  // API响应处理器
  private handleApiResponse(msg: any): void {
    const req = this.promisePool[msg.apiName];
    if (!req) return;
  
    // 处理commitJob特殊逻辑
    if (msg.apiName === 'commitJob') {
      if (msg.resultAck?.info === 'commitJob ok!') {
        req.resolve(msg);
        this.cleanupRequest(msg.apiName, req);
        this.isProcessingCommitJob = true;
      }
    } else {
      if (msg.resultAck?.errorCode!== 0) {
        this.isProcessingCommitJob = false;
      }
      req.resolve(msg);
      this.cleanupRequest(msg.apiName, req);
    }
  }

   // 事件推送处理器
  private handleEventPush(msg: any): void {
    // console.log("niimbot-msg-socket-handleEventPush",msg);
    // console.log("niimbot-msg-socket-handleEventPush",this.printListeners);
    // 处理commitJob特殊逻辑
    this.printListeners.forEach(listener => listener(msg));
    // 错误状态处理
    if (msg.resultAck?.errorCode !== 0) {
      this.isProcessingCommitJob = false;
    }
  }
  
  // 新增请求清理方法
  private cleanupRequest(apiName: string, req: PromisePoolItem): void {
    if (req) {
        clearTimeout(req.timeoutCallback);
    }
    delete this.promisePool[apiName];
  }

  // 关闭websocket链接 closing 为true时为手动关闭
  public close(closing: boolean = true): void {
    this.customClose = closing;
    if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
      this.clearAllListeners();
      if (this.openChangeCallback) {
        this.openChangeCallback(false);
      }
      this._websocket.close();
    }
  }
  // content中为发送到ws所有数据
  public send(content: any, timeout: number | null = null): Promise<any> {
    // 记录当次请求时的时间戳，便于检验超时情况
    const timestamp = new Date().getTime();
    // 如果 this.options.timeout 秒后ws无消息返回
    const timeoutCallback = setTimeout(
      () => {
        //发起commitJob后，将是否处理提交数据状态恢复成未处理状态，便于后续处理非提交数据后立即返回的异常消息
        if (content.apiName === "commitJob") {
          this.isProcessingCommitJob = true;
        }
        const req = this.promisePool[content.apiName];
        if (req && req.timestamp === timestamp) {
          req.resolve({
            apiName: content.apiName,
            resultAck: { errorCode: 22 },
            Error: "打印超时",
          });
          clearTimeout(req.timeoutCallback);
          delete this.promisePool[content.apiName];
        }
      },
      timeout !== null ? timeout : this.options.timeout
    );
    return new Promise((resolve, reject) => {
      this.promisePool[content.apiName] = {
        timestamp,
        content,
        resolve,
        reject,
        timeoutCallback,
      };
      // console.log("_websocket", this._websocket);
      // console.log("_websocket.readyState ", this._websocket.readyState);
      // console.log("...content ", JSON.stringify({ ...content }));
      if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
        this._websocket.send(JSON.stringify({ ...content }));
      } else {
        this.promisePool[content.apiName].resolve({
            apiName: content.apiName,
            resultAck: { errorCode: 22 },
            Error: "打印超时",
        });
      }
    });
  }
  // 自定义消息发送
  public customSend(content: any): void {
    if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
        this._websocket.send(JSON.stringify({ ...content }));
    }
  }
  // 添加打印监听方法
  public addPrintListener(callback: (msg: any) => void): (msg: any) => void {
    if (typeof callback !== "function") {
      console.error("addPrintListener: callback must be a function");
      return callback; // Or throw error
    }

    // 先移除可能存在的相同回调
    this.printListeners.delete(callback);
    // 添加新的回调
    this.printListeners.add(callback);

    // 返回用于移除监听器的函数
    return callback;
  }
  // 移除打印监听方法
  /**
   * 移除指定的打印监听回调函数
   * @param {Function} callback - 需要移除的回调函数
   * @returns {void}
   */
  public removePrintListener(callback: (msg: any) => void): void {
    // 参数校验：回调函数必须存在
    if (!callback) {
      console.error("removePrintListener: callback is required");
      return;
    }

    // 尝试从监听器集合中删除回调
    const removed = this.printListeners.delete(callback);
    
    // 未找到回调时输出警告
    if (!removed) {
      console.warn("removePrintListener: callback not found in listeners");
    }
  }
  // 添加用于调试的方法
  public getListenersCount(): number {
    return this.printListeners.size;
  }
  // 修改清理所有监听器的方法
  public clearAllListeners(): void {
    const count = this.printListeners.size;
    this.printListeners.clear();
    console.log(`Cleared ${count} listeners`);
  }
}
