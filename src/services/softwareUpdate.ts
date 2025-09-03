/**
 * 软件更新
 */
import { request } from '@umijs/max';

/**
 * 添加或修改角色
 * @param options
 * @returns
 */
export async function uploadToObs(endpoint: string, data: any) {
  // const obsConfig = {
  //   accessKeyId: 'HPUAIOZNYKEAPWTTMWRJ', // 密钥AK
  //   bucket: 'userplayer', // 需要上传的桶名
  //   callbackBodyType: 'application/json', // 响应体格式
  //   signature: 'w9u3wuq9SEmwbAB7C8gNdoJfjRTRyofFKHS2FCgi', // POST上传的签名
  //   prefix: 'wz-software-update', // POST上传对象名前缀
  //   host: 'obs.cn-north-4.myhuaweicloud.com', // POST上传host地址
  //   callbackUrl: 'http://obs-demo.huaweicloud.com:23450/callback', // POST上传回调的地址
  //   policy: 'eyJleHBpcmF***************************************ifV19', // POST上传policy
  //   callbackBody: 'key=$(key)&hash=$(etag)&fname=$(fname)&fsize=$(size)', // POST上传回调的请求体
  // };

  return request<Record<string, any>>(endpoint, {
    method: 'POST',
    data: data,
  });
}
