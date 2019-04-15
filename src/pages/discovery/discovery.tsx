import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { DiscoveryProps, DiscoveryState } from './discovery.interface'
import './discovery.scss'

class Discovery extends Component<DiscoveryProps,DiscoveryState > {
  config:Config = {
    navigationBarTitleText: '发现'
  }
  constructor(props: DiscoveryProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    return (
      <View className='discovery-wrap'>

      </View>
    )
  }
}

export default Discovery
