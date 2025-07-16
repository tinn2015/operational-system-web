/**
 * 上传打包后的文件到服务器
 */
const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const sftp = new Client();

const config = {
  host: '1.94.137.57',
  port: '22',
  username: 'root',
  password: 'Nacos,2024$', 
};

const localDir = path.resolve(__dirname, 'dist');
const remoteDir = '/etc/nginx/html/wz-admin';

async function uploadDir(local, remote) {
  const files = fs.readdirSync(local);
  for (const file of files) {
    const localPath = path.join(local, file);
    const remotePath = remote + '/' + file;
    if (fs.statSync(localPath).isDirectory()) {
      try { await sftp.mkdir(remotePath, true); } catch {}
      await uploadDir(localPath, remotePath);
    } else {
      await sftp.put(localPath, remotePath);
      console.log(`上传: ${localPath} -> ${remotePath}`);
    }
  }
}

sftp.connect(config)
  .then(() => uploadDir(localDir, remoteDir))
  .then(() => {
    console.log('上传到测试环境完成');
    return sftp.end();
  })
  .catch(err => {
    console.error('上传失败', err);
  });