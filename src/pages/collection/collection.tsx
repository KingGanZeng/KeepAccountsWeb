
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { CollectionProps, CollectionState } from './collection.interface'
import './collection.scss'
// import { } from '../../components'

// @connect(({ collection }) => ({
//     ...collection,
// }))

class Collection extends Component<CollectionProps,CollectionState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: CollectionProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <View className='collection-wrap'>
          
      </View>
    )
  }
}

export default Collection
