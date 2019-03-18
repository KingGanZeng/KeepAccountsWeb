
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { TravelDetailsProps, TravelDetailsState } from './travelDetails.interface'
import './travelDetails.scss'
// import { } from '../../components'

// @connect(({ travelDetails }) => ({
//     ...travelDetails,
// }))

class TravelDetails extends Component<TravelDetailsProps,TravelDetailsState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: TravelDetailsProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    return (
      <View className='travelDetails-wrap'>
        <View className='header-wrapper'>
          <View className='header-card'>
            <View className='card-header'>
              <View className='total-expense'>
                ￥<Text className='expense-money'>2000.00</Text>
              </View>
              <View className='expense-title'>总支出</View>
            </View>
            <View className='card-content at-row'>
              <View className='budget-block at-col'>
                <View className='budget-title'>预算</View>
                <View className='budget-money-wrapper'>
                  ￥<Text className='budget-money'>2000.00</Text>
                </View>
              </View>
              <View className='count-block at-col'>
                <View className='count-title'>笔数</View>
                <View className='count-money'>2</View>
              </View>
            </View>
          </View>
        </View>
        <View className='travelDetails-container'>
          <View className='container-title'>开销记录</View>
          <View className='details-content'>
            <View className='detail-item at-row at-row__justify--between'>
              <View className='detail-name-date at-col at-col-1 at-col--auto'>
                <View className='detail-name'>食品</View>
                <View className='detail-date'>2.2</View>
                <View className='detail-note'>这是一条备注</View>
              </View>
              <View className='detail-money at-col at-col-1 at-col--auto'>
                ￥2500
              </View>
            </View>
            <View className='detail-item at-row at-row__justify--between'>
              <View className='detail-name-date at-col at-col-1 at-col--auto'>
                <View className='detail-name'>食品</View>
                <View className='detail-date'>2.2</View>
                <View className='detail-note'>这是一条备注</View>
              </View>
              <View className='detail-money at-col at-col-1 at-col--auto'>
                ￥2500
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default TravelDetails
