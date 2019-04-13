
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { SharePageProps, SharePageState } from './sharePage.interface'
import './sharePage.scss'
// import { } from '../../components'

// @connect(({ sharePage }) => ({
//     ...sharePage,
// }))

class SharePage extends Component<SharePageProps,SharePageState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: SharePageProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <View className='sharePage-wrap'>
          
      </View>
    )
  }
}

export default SharePage
