
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtGrid } from "taro-ui"
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { ChargeToAccountProps, ChargeToAccountState } from './chargeToAccount.interface'
import './chargeToAccount.scss'
// import { } from '../../components'


// @connect(({ chargeToAccount }) => ({
//     ...chargeToAccount,
// }))

class ChargeToAccount extends Component<ChargeToAccountProps,ChargeToAccountState > {
  config:Config = {
    navigationBarTitleText: '记账'
  }
  constructor(props: ChargeToAccountProps) {
    super(props)
    this.state = {
      hasChosenType: false,
    }
  }

  componentDidMount() {

  }

  render() {
    const hasChosenType = this.state.hasChosenType
    return (
      <View className='chargeToAccount-wrap'>
        {
          hasChosenType
            ? <View className='editAccountItem'>
            </View>
            : <View className='editType'>
              <View>
                <Text className='edit-panel-title'>支出</Text>
                <AtGrid data={
                  [
                    {
                      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                      value: '餐饮'
                    },
                    {
                      image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                      value: '购物'
                    },
                    {
                      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                      value: '日用'
                    },
                    {
                      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                      value: '交通'
                    },
                    {
                      image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                      value: '蔬菜'
                    },
                    {
                      image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                      value: '水果'
                    }
                  ]
                }
                />
                {/*<View incomeAccount={false}>*/}
                  {/*<View className='at-icon at-icon-reload'></View>*/}
                  {/*<Text>切换为收入记账</Text>*/}
                {/*</View>*/}
              </View>
              <View>
                <Text className='edit-panel-title'>收入</Text>
                <AtGrid data={
                  [
                    {
                      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                      value: '工资'
                    },
                    {
                      image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                      value: '兼职'
                    },
                    {
                      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                      value: '理财'
                    },
                    {
                      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                      value: '礼金'
                    },
                  ]
                }
                />
                {/*<View incomeAccount={false}>*/}
                  {/*<View className='at-icon at-icon-reload'></View>*/}
                  {/*<Text>切换为支出记账</Text>*/}
                {/*</View>*/}
              </View>
            </View>
        }
      </View>
    )
  }
}

export default ChargeToAccount
