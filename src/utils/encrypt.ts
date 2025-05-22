/**
 * 加密工具类
 * 实现加密和哈希算法
 */
import { TripleDES, enc, mode, pad, SHA1, SHA256 } from 'crypto-js';

// 加密密钥 (实际应用中应从环境变量或配置文件获取)
const SECRET_KEY = '77ec31def88e7e58de6331b9a3a83d8d';

/**
 * 3DES加密函数
 * @param data 需要加密的数据，通常是密码
 * @returns 加密后的字符串，十六进制格式
 */
export function threeDesEncrypt(data: string): string {
    if (!data) return '';

    try {
        // 使用TripleDES进行加密
        const encrypted = TripleDES.encrypt(data, enc.Utf8.parse(SECRET_KEY), {
            mode: mode.ECB,
            padding: pad.Pkcs7
        });

        // 返回十六进制编码的加密结果，而不是Base64
        return encrypted.ciphertext.toString(enc.Utf8);
    } catch (error) {
        console.error('加密失败:', error);
        // 如果加密失败，返回原始数据（生产环境可能需要更健壮的错误处理）
        return data;
    }
}

/**
 * SHA1哈希函数
 * @param data 需要哈希的数据，通常是密码
 * @returns SHA1哈希后的字符串，十六进制格式
 */
export function sha1Hash(data: string): string {
    if (!data) return '';

    try {
        // 计算SHA1哈希值
        const hash = SHA1(data);

        // 返回十六进制编码的哈希结果
        return hash.toString(enc.Hex);
    } catch (error) {
        console.error('哈希计算失败:', error);
        return data;
    }
}

/**
 * SHA256哈希函数
 * @param data 需要哈希的数据，通常是密码
 * @returns SHA256哈希后的字符串，十六进制格式
 */
export function sha256Hash(data: string): string {
    if (!data) return '';

    try {
        // 计算SHA256哈希值
        const hash = SHA256(data);

        // 返回十六进制编码的哈希结果
        return hash.toString(enc.Hex);
    } catch (error) {
        console.error('哈希计算失败:', error);
        return data;
    }
} 