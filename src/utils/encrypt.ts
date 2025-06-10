/**
 * 加密工具类
 * 实现加密和哈希算法
 */
import CryptoJS from 'crypto-js';
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

/**
 * Base64解码函数（用于文本数据）
 * @param base64Str 需要解码的base64字符串
 * @returns 解码后的字符串
 */
export function base64Decode(base64Str: string): string {
    if (!base64Str) return '';

    try {
        // 移除可能存在的data URI scheme前缀
        const actualBase64 = base64Str.replace(/^data:.*,/, '');

        // 使用crypto-js的Base64模块进行解码
        const words = CryptoJS.enc.Base64.parse(actualBase64);
        return CryptoJS.enc.Utf8.stringify(words);
    } catch (error) {
        console.error('Base64解码失败:', error);
        return '';
    }
}

/**
 * 处理base64图片字符串
 * @param base64Str 原始base64字符串
 * @returns 处理后的可显示的base64字符串
 */
export const handleBase64Image = (base64Str: any) => {
    if (!base64Str) return '';

    try {
        // 如果已经是完整的data URI，直接返回
        if (base64Str.startsWith('data:image')) {
            return base64Str;
        }

        // 判断图片类型
        const signatures = {
            '/9j/': 'data:image/jpeg;base64,',  // JPEG
            'iVBORw0KGgo': 'data:image/png;base64,',  // PNG
            'R0lGOD': 'data:image/gif;base64,',  // GIF
            'PHN2Zw': 'data:image/svg+xml;base64,',  // SVG
        };

        // 检查base64字符串的开头，确定图片类型
        let imageHeader = 'data:image/jpeg;base64,';  // 默认作为JPEG处理
        for (const [signature, header] of Object.entries(signatures)) {
            if (base64Str.startsWith(signature)) {
                imageHeader = header;
                break;
            }
        }

        // 返回添加了适当头部的base64字符串
        return `${imageHeader}${base64Str}`;
    } catch (error) {
        console.error('Base64处理错误:', error);
        return '';
    }
};

