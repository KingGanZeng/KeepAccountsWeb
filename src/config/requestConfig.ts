import index from '../pages/index/config' // index接口
import accountBook from '../pages/accountBook/config'
import newBook from '../pages/newBook/config'
import newManagement from '../pages/newManagement/config'
/**
 * 请求的公共参数
 */
export const commonParame = {}

/**
 * 请求映射文件
 */
export const requestConfig = {
  loginUrl: '/api/user/wechat-auth', // 微信登录接口
  registerUrl: '/api/user/create', // 注册接口
  ...index,
  ...accountBook,
  ...newBook,
  ...newManagement
}
