import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { TravelPartyContentProps, TravelPartyContentState } from './TravelPartyContent.interface'
import './TravelPartyContent.scss'
// @ts-ignore
import { LineChart } from '../LineChart/LineChart'

class TravelPartyContent extends Component<TravelPartyContentProps,TravelPartyContentState > {
  constructor(props: TravelPartyContentProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:TravelPartyContentProps = {}

  jumpToDetailBook() {
    Taro.navigateTo({
      url: "/pages/index/index?bookId=" + 321 +
        '&bookName=' + '今年旅游' +
        '&bookType=' + 'homeDecoration'
    })
  }

  render() {
    return (
      <View className='fx-TravelPartyContent-wrap'>
        <Swiper
          className='inner-container'
          indicatorColor='#999'
          indicatorActiveColor='#ffffff'
          circular
          indicatorDots>
          <SwiperItem>
            <View className='inner-item' onClick={this.jumpToDetailBook}>
              <View className='item-container'>
                <View className='item-header at-row at-row__justify--between'>
                  <View className='at-col at-col-1 at-col--auto header-left'>
                    <View className='travel-title'>我在这里啊啊啊啊啊啊啊</View>
                    <View className='travel-create-time'>2019年3月16日</View>
                  </View>
                  <View className='at-col at-col-1 at-col--auto header-right'>
                    ￥2578.00
                  </View>
                </View>
                <View className='item-content at-row'>
                  <View className='at-col image-content' />
                  <View className='at-col detail-content'></View>
                </View>
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='inner-item' onClick={this.jumpToDetailBook}>
              <View className='item-container'>
                <View className='item-header at-row at-row__justify--between'>
                  <View className='at-col at-col-1 at-col--auto header-left'>
                    <View className='travel-title'>我在这里啊啊啊啊啊啊啊</View>
                    <View className='travel-create-time'>2019年3月16日</View>
                  </View>
                  <View className='at-col at-col-1 at-col--auto header-right'>
                    ￥2578.00
                  </View>
                </View>
                <View className='item-content at-row'>
                  <View className='at-col image-content' />
                  <View className='at-col detail-content'></View>
                </View>
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='inner-item' onClick={this.jumpToDetailBook}>
              <View className='item-container'>
                <View className='item-header at-row at-row__justify--between'>
                  <View className='at-col at-col-1 at-col--auto header-left'>
                    <View className='travel-title'>我在这里啊啊啊啊啊啊啊</View>
                    <View className='travel-create-time'>2019年3月16日</View>
                  </View>
                  <View className='at-col at-col-1 at-col--auto header-right'>
                    ￥2578.00
                  </View>
                </View>
                <View className='item-content at-row'>
                  <View className='at-col image-content' />
                  <View className='at-col detail-content'></View>
                </View>
              </View>
            </View>
          </SwiperItem>
        </Swiper>
        <LineChart />
      </View>
    )
  }
}

export default TravelPartyContent
