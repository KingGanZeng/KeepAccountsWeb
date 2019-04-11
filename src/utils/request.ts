/**
 * 封装HTTP请求
 */

import Taro, { Component } from '@tarojs/taro'
import {
  ISMOCK,
  MAINHOST
} from '../config'
import {
  commonParame,
  requestConfig
} from '../config/requestConfig'
import Tips from './tips'

// import { createLogger } from './logger'

declare type Methods = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
declare type Headers = { [key: string]: string };
declare type Datas = { method: Methods;[key: string]: any; };
interface Options {
  url: string;
  host?: string;
  method?: Methods;
  data?: Datas;
  header?: Headers;
}

export class Request {
  //登陆的promise
  static loginReadyPromise: Promise<any> = Promise.resolve()
  // 正在登陆
  static isLogining: boolean = false
  // 导出的api对象
  static apiLists: { [key: string]: () => any; } = {}
  // token
  static token: string = ''
  // uid
  static uid: string = ''
  // username
  static username: string = ''

  // constructor(setting) {

  // }
  /**
   * @static 处理options
   * @param {Options | string} opts
   * @param {Datas} data
   * @returns {Options}
   * @memberof Request
   */
  static combineOptions(opts, data: Datas, method: Methods): Options {
    typeof opts === 'string' && (opts = { url: opts })
    // console.log(222,opts.host,MAINHOST,`${opts.host || MAINHOST}`)
    return {
      data: { ...commonParame, ...opts.data, ...data },
      method: opts.method || data.method || method || 'GET',
      url: `${opts.host || MAINHOST}${opts.url}`
    }
  }

  static getToken() {
    !this.token && (this.token = Taro.getStorageSync('token'))
    return this.token
  }

  /**
   *
   * @static request请求 基于 Taro.request
   * @param {Options} opts
   */
  static async request(opts: Options) {
    // token不存在
    // if (!this.getToken()) { await this.login() }

    // token存在
    // let options = Object.assign(opts, { header: { 'token': this.getToken() } })

    //  Taro.request 请求
    const res = await Taro.request(opts)

    // 是否mock
    if (ISMOCK) { return res.data }

    // 登陆失效
    if (res.data.code === 99999) { await this.login(); return this.request(opts) }

    // 请求成功
    // if (res.data && res.data.code === 0 || res.data.succ === 0) { return res.data }
    if (res.data) { return res.data }

    // 请求错误
    const d = { ...res.data, err: (res.data && res.data.msg) || `网络错误～` }
    Tips.toast(d.err);
    throw new Error(d.err)
  }

  /**
   *
   * @static 登陆
   * @returns  promise
   * @memberof Request
   */
  static login() {
    if (!this.isLogining) { this.loginReadyPromise = this.onLogining() }
    return this.loginReadyPromise
  }

  static getOpenId(code) {
    return new Promise(async (resolve, reject) => {
      const { data } = await Taro.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid: 'wx47bdf41ed1be8aa2',
          secret: '53ae20f0b7de9c2048526fb2a0a6b063',
          js_code: code,
          grant_type: 'authorization_code',
        }
      })

      if (!data) {
        reject()
        return
      }
      console.log("获取到openid：", data.openid)
      // 将openid存入缓存
      try {
        Taro.setStorageSync('uid', data.openid)
      } catch (e) {
        console.trace(e)
      }
      resolve()
    })
  }

  /**
   *
   * @static 登陆的具体方法
   * @returns
   * @memberof Request
   */
  static onLogining() {
    this.isLogining = true
    return new Promise(async (resolve, reject) => {
      // 获取code

      const { code } = await Taro.login()
      await this.getOpenId(code)
      const uid = Taro.getStorageSync('uid')

      // 请求登录
      const { data } = await Taro.request({
        url: `${MAINHOST}${requestConfig.loginUrl}`,
        data: { uid: uid }
      });
      Taro.setStorageSync('username', data.results[0].username);
      const username = Taro.getStorageSync('username');

      // 未注册用户自动注册
      if (!data.results || data.results.length == 0) {
        const { regisiterData } = await Taro.request({
          method: 'POST',
          url: `${MAINHOST}${requestConfig.registerUrl}`,
          data: {
            uid: uid,
            username: username
          }
        })
        if (!regisiterData) {
          reject()
          return
        }
      }

      // Taro.setStorageSync('token', data.data.token)
      this.isLogining = false
      resolve()
    })
  }

  /**
   *
   * @static  创建请求函数
   * @param {(Options | string)} opts
   * @returns
   * @memberof Request
   */
  static creatRequests(opts: Options | string): () => {} {
    return async (data = {}, method: Methods = "GET") => {
      // console.log(333, opts)
      const _opts = this.combineOptions(opts, data, method)
      const res = await this.request(_opts)
      // createLogger({ title: 'request', req: _opts, res: res })
      return res
    }
  }

  /**
   *
   * @static 抛出整个项目的api方法
   * @returns
   * @member Request
   */
  static getApiList(requestConfig) {
    if (!Object.keys(requestConfig).length) return {}

    Object.keys(requestConfig).forEach((key) => {
      this.apiLists[key] = this.creatRequests(requestConfig[key])
    })

    return this.apiLists
  }
}

// 导出
const Api = Request.getApiList(requestConfig)
Component.prototype.$api = Api
export default Api as any
