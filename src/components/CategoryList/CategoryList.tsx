import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CategoryListProps, CategoryListState } from './CategoryList.interface'
import './CategoryList.scss'

class CategoryList extends Component<CategoryListProps,CategoryListState > {
  constructor(props: CategoryListProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:CategoryListProps = {}

  render() {
    return (
      <View className='fx-CategoryList-wrap'>

      </View>
    )
  }
}

export default CategoryList
