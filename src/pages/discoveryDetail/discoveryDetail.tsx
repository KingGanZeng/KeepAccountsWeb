
import Taro, { Component, Config } from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {AtToast} from "taro-ui";
import { DiscoveryDetailProps, DiscoveryDetailState } from './discoveryDetail.interface'
import './discoveryDetail.scss'
import {MAINHOST} from "../../config";


class DiscoveryDetail extends Component<DiscoveryDetailProps,DiscoveryDetailState > {
  config:Config = {
    navigationBarTitleText: '发现'
  }
  constructor(props: DiscoveryDetailProps) {
    super(props)
    const recommendInfoId = decodeURIComponent(this.$router.params.recommend_info_id)
    this.state = {
      recommendInfoId: parseInt(recommendInfoId),
      recommendInfo: {},
      isCollect: false,
      iconClass: 'at-icon at-icon-star',
      hasError: false,
      hasErrorMsg: '新建记录错误',
      hasErrorIcon: 'close-circle',
    }
  }
  /**
   * 获取用户收藏列表并判断是否已收藏
   */
  async getUserRecommendList() {
    const uid = Taro.getStorageSync('uid')
    let result:any = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getCollectionList?uid=` + uid,
    })
    if (result.data && result.data.results.length > 0) {
      result = result.data.results[0]
      this.setState({
        collectionId: result.collection_id
      })
      for (const infoNum of result.info_id) {
        if (this.state.recommendInfoId == infoNum) {
          this.setState({
            isCollect: true,
            iconClass: 'at-icon at-icon-star-2'
          })
        }
      }
    } else {
      await this.createUserCollection()
    }
  }

  /**
   * 如果用户没有收藏夹，则为其创建
   */
  async createUserCollection() {
    const uid = Taro.getStorageSync('uid')
    const result = await Taro.request({
      method: "POST",
      url: `${MAINHOST}/api/createCollection`,
      data: {
        uid: uid
      }
    })
    if (result.data) {
      this.setState({
        collectionId: result.data.results[0]
      })
    }
  }

  /**
   * 获取文章信息
   */
  async getRecommendInfo() {
    const info_id = this.state.recommendInfoId
    let result:any = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getRecommendInfoList?info_id=` + info_id
    })
    if (result.data) {
      result = result.data.results[0]
      this.setState({
        recommendInfo: result
      })
    }
  }

  /**
   * 添加至收藏
   */
  async addToCollect() {
    const result = await Taro.request({
      method: "POST",
      url: `${MAINHOST}/api/editCollectionItem`,
      data: {
        collection_id: this.state.collectionId,
        info_id: this.state.recommendInfoId,
      }
    })
    if (result.data.hasCollected) {
      this.setState({
        isCollect: true,
        iconClass: 'at-icon at-icon-star-2',
        hasError: true,
        hasErrorMsg: '收藏成功',
        hasErrorIcon: 'check-circle',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '添加收藏失败',
        hasErrorIcon: 'close-circle',
      })
    }
  }

  /**
   * 从收藏中移除
   */
  async removeFromCollect() {
    const result = await Taro.request({
      method: "DELETE",
      url: `${MAINHOST}/api/editCollectionItem`,
      data: {
        collection_id: this.state.collectionId,
        info_id: this.state.recommendInfoId,
      }
    })
    if (result.data.hasDelete) {
      this.setState({
        isCollect: false,
        iconClass: 'at-icon at-icon-star',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除收藏失败',
        hasErrorIcon: 'close-circle',
      })
    }
  }

  /**
   * 点击收藏按钮事件
   */
  collectInfo() {
    const nowCollectState = this.state.isCollect
    this.setState({
      hasError: false,
    }, async() => {
      if (!nowCollectState) {
        // 如果点击后为收藏状态
        await this.addToCollect()
      } else {
        await this.removeFromCollect()
      }
    })
  }

  async componentDidMount() {
    await this.getRecommendInfo()
    await this.getUserRecommendList()
  }

  render() {
    const item = this.state.recommendInfo
    const itemIcon = this.state.iconClass

    return (
      <View className='discoveryDetail-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        {item && <View className='discovery-header'>
          <View className='discovery-name'>{item.info_name}</View>
          <View className='discovery-time'>{item.create_timestamp !=='undefined' && item.create_timestamp.split('T')[0]}</View>
          <View className='discovery-category'>
            {item.first_category && <Text className='category-wrapper first-category'>{item.first_category}</Text> }
            {item.second_category && <Text className='category-wrapper second-category'>{item.second_category}</Text> }
          </View>
          <View onClick={this.collectInfo} className={itemIcon} />
        </View>}
        {item && <View className='discovery-all-content'>{item.info_content}</View>}
      </View>
    )
  }
}

export default DiscoveryDetail
