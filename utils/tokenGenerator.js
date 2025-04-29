/**
 * 令牌生成器工具
 * 
 * 用于生成和验证密码重置令牌
 */

const crypto = require('crypto');

/**
 * 生成随机的密码重置令牌
 * @returns {string} 随机生成的重置令牌
 */
exports.generateResetToken = () => {
  // 生成32个字节的随机字符串，并转为十六进制
  return crypto.randomBytes(32).toString('hex');
};

/**
 * 对令牌进行哈希处理
 * 在数据库中存储哈希后的令牌而非原始令牌，提高安全性
 * @param {string} token - 原始令牌
 * @returns {string} 哈希后的令牌
 */
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
}; 