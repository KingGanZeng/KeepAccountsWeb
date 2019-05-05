import Taro, { Component, Config } from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import { AtButton } from 'taro-ui'
// import Tips from '../../utils/tips'
import { RecommendInfoProps, RecommendInfoState } from './recommendInfo.interface'
import '../travelDetails/travelDetails.scss'
import './recommendInfo.scss'
import '../../assets/iconfont/iconfont.scss'
import {globalData} from "../../utils/common";

class RecommendInfo extends Component<RecommendInfoProps,RecommendInfoState > {
  config:Config = {
    navigationBarTitleText: '大家都在记'
  }
  constructor(props: RecommendInfoProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    const recommendList = [
      {icon_name: 'icon-Hotel', record_type: 'expense', popular: 94},
      {icon_name: 'icon-icon-test1', record_type: 'expense', popular: 87},
      {icon_name: 'icon-icon-test2', record_type: 'expense', popular: 80},
      {icon_name: 'icon-kouhong', record_type: 'expense', popular: 80},
      {icon_name: 'icon-icon-test3', record_type: 'expense', popular: 76},
      {icon_name: 'icon-huodong', record_type: 'expense', popular: 73},
      {icon_name: 'icon-wukong1', record_type: 'income', popular: 69},
      {icon_name: 'icon-yiyuan', record_type: 'expense', popular: 67},
      {icon_name: 'icon-icon-test', record_type: 'expense', popular: 62},
    ]
    const recommendContent = recommendList.map((item, index) => {
      let name = globalData.categoryList['travelParty'][item.record_type].map((categoryItem) => {
        if (categoryItem.icon == item.icon_name) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0];
      const note = item.record_type == 'expense' ? '支出' : '收入'
      return (
        <View
          key={'recommend-' + index}
          className='detail-item at-row at-row__justify--between at-row__align--center'
        >
          <View className='detail-name-date at-col at-col-1 at-col--auto'>
            <View className='icon-wrapper'>
              <View
                style={name.bgColor}
                className={`icon-item iconfont ${item.icon_name}`}
              />
            </View>
            <View className='text-wrapper'>
              <View className='detail-name'>{name.title}</View>
              <View className='detail-note'>类型:{note}</View>
            </View>
          </View>
          <View className='detail-popular at-col at-col-1 at-col--auto'>
            <View className='add-to-myItem'>
              <AtButton type='primary' size='small'>加到我的项目</AtButton>
            </View>
            人气值：<Text className='popular-num'>{item.popular}</Text>
          </View>
        </View>
      )
    })

    return (
      <View className='recommendInfo-wrap travelDetails-wrap'>
        <View className='travelDetails-container'>
          <View className='recommend-wrapper'>
            <View className='recommend-content'>
              {recommendContent}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default RecommendInfo
