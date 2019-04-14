import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { WishComponentProps, WishComponentState } from './WishComponent.interface'
import './WishComponent.scss'

class WishComponent extends Component<WishComponentProps,WishComponentState > {
  constructor(props: WishComponentProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:WishComponentProps = {}

  render() {
    return (
      <View className='fx-WishComponent-wrap'>

      </View>
    )
  }
}

export default WishComponent
