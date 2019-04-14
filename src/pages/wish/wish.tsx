
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { WishProps, WishState } from './wish.interface'
import './wish.scss'

class Wish extends Component<WishProps,WishState > {
  config:Config = {
    navigationBarTitleText: '我的心愿'
  }
  constructor(props: WishProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    return (
      <View className='wish-wrap'>

      </View>
    )
  }
}

export default Wish
