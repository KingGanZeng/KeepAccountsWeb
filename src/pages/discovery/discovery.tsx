import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DiscoveryProps, DiscoveryState } from './discovery.interface'
import './discovery.scss'
import {MAINHOST} from "../../config";
import Tips from '../../utils/tips'

class Discovery extends Component<DiscoveryProps,DiscoveryState > {
  config:Config = {
    navigationBarTitleText: '发现'
  }
  constructor(props: DiscoveryProps) {
    super(props)
    this.state = {
      discoveryList: [],
      nextPageUrl: `${MAINHOST}/api/getRecommendInfoList?page=1`,
      hasNext: true,
    }
  }

  /**
   * 获取发现频道信息
   */
  async getDiscoveryData() {
    // TODO:这里需要根据用户的权重值做请求
    try {
      const result = await Taro.request({
        method: "GET",
        url: this.state.nextPageUrl,
      })
      if (result.data) {
        const tmpList = this.state.discoveryList
        tmpList.push(...result.data.results)
        this.setState({
          discoveryList: tmpList,
          nextPageUrl: result.data.next,
          hasNext: result.data.next !== null,
        }, () => {
          Tips.loaded()
        })
      }
    } catch (e) {
      console.log(e)
      Tips.loaded()
    }
  }

  handleCheckDiscovery(discoveryItem) {
    Taro.navigateTo({
      url: '/pages/discoveryDetail/discoveryDetail?recommend_info_id=' + discoveryItem.info_id
    })
  }

  async onReachBottom() {
    if (this.state.hasNext) {
      await this.getDiscoveryData()
    }
  }

  async componentDidMount() {
    Tips.loading()
    await this.getDiscoveryData()
  }

  render() {
    const list = this.state.discoveryList
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
      <View className='discovery-wrap'>
        {contentView}
        {!this.state.hasNext && <View className='no-more-toast'>已全部加载完毕</View>}
      </View>
    )
  }
}

export default Discovery
