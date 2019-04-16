
import Taro, { Component, Config } from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import { CollectionProps, CollectionState } from './collection.interface'
import './collection.scss'
import {MAINHOST} from "../../config";
import Tips from '../../utils/tips'

class Collection extends Component<CollectionProps,CollectionState > {
  config:Config = {
    navigationBarTitleText: '我的收藏'
  }
  constructor(props: CollectionProps) {
    super(props)
    this.state = {
      collectionList: [],
    }
  }

  /**
   * 获取推荐信息
   * @param info_id
   */
  async getRecommendInfo(info_id) {
    const result = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getRecommendInfoList?info_id=` + info_id,
    })
    return result.data.results[0]
  }

  /**
   * 获取收藏频道信息
   */
  async getCollectionData() {
    const uid = Taro.getStorageSync('uid')
    try {
      let result:any = await Taro.request({
        method: "GET",
        url: `${MAINHOST}/api/getCollectionList?uid=` + uid,
      })
      if (result.data) {
        result = result.data.results[0]
        const collectionList:any = []
        for (const infoId of result.info_id) {
          const tmpInfoItem = await this.getRecommendInfo(infoId)
          collectionList.push(tmpInfoItem)
        }
        this.setState({
          collectionList: collectionList
        }, () => {
          Tips.loaded()
        })
      }
    } catch (e) {
      Tips.loaded()
      console.log(e)
    }
  }

  handleCheckDiscovery(discoveryItem) {
    Taro.navigateTo({
      url: '/pages/discoveryDetail/discoveryDetail?recommend_info_id=' + discoveryItem.info_id
    })
  }

  async componentDidShow() {
    Tips.loading()
    await this.getCollectionData()
  }

  render() {
    const list = this.state.collectionList
    const contentView = list.map((item, key) => {
      return (
        <View
          className='discovery-item'
          key={key}
          onClick={this.handleCheckDiscovery.bind(this, item)}
        >
          <View className='discovery-header'>
            <View className='discovery-name'>{item.info_name}</View>
            <View className='discovery-time'>{item.create_timestamp.split('T')[0]}</View>
            <View className='discovery-category'>
              {item.first_category && <Text className='category-wrapper first-category'>{item.first_category}</Text> }
              {item.second_category && <Text className='category-wrapper second-category'>{item.second_category}</Text> }
            </View>
          </View>
          <View className='discovery-brief-content'>{item.info_content}</View>
          <View className='content-more'>
            查看更多<View className='at-icon at-icon-chevron-right' />
          </View>
        </View>
      )
    })

    return (
      <View className='collection-wrap'>
        {contentView}
        { list.length == 0 && <View className='empty-wrapper'>暂无收藏</View> }
      </View>
    )
  }
}

export default Collection
