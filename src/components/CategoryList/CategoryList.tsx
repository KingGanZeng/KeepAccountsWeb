import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CategoryListProps, CategoryListState } from './CategoryList.interface'
import './CategoryList.scss'
import '../../assets/iconfont/iconfont.scss'
import {globalData} from "../../utils/common";

class CategoryList extends Component<CategoryListProps,CategoryListState > {
  constructor(props: CategoryListProps) {
    super(props);
    this.state = {
      bookType: this.props.nowBookType,
      type: this.props.nowType,
    }
  }
  static options = {

    addGlobalClass: true
  };
  static defaultProps:CategoryListProps = {
    nowBookType: 'dayLife',
    nowBookId: 0,
    nowType: 'income',
  };

  /**
   * 创建新记账
   * @param item
   */
  createRecord = (item) => {
    const itemInfo = {
      actionTitle: item.title,
      actionIcon: item.icon,
      actionIconBackgroundColor: item.bgColor,
      openState: true,
    };
    this.props.onModalActionState(itemInfo)
  };

  render() {
    // 生成图标列表
    let iconArr:any;
    if(this.state.bookType === 'dayLife') {
      iconArr = globalData.categoryList.dayLife
    } else if(this.state.bookType === 'travelParty') {
      iconArr = globalData.categoryList.travelParty
    } else if(this.state.bookType === 'homeDecoration') {
      iconArr = globalData.categoryList.homeDecoration
    } else if(this.state.bookType === 'socialRelation') {
      iconArr = globalData.categoryList.socialRelation
    } else if(this.state.bookType === 'moneyManagement') {
      iconArr = globalData.categoryList.moneyManagement
    } else if(this.state.bookType === 'rent') {
      iconArr = globalData.categoryList.rent
    } else if(this.state.bookType === 'others') {
      iconArr = globalData.categoryList.others
    } else if(this.state.bookType === 'child') {
      iconArr = globalData.categoryList.child
    } else if(this.state.bookType === 'car') {
      iconArr = globalData.categoryList.car
    }
    const thisType = this.state.type;
    const iconContent = iconArr[thisType].map(item => {
      return (
        <View
          className='at-col at-col-3 choice-wrapper'
          onClick={this.createRecord.bind(this, item)}
          key={item.icon}
        >
          <View
            className='icon-wrapper'
            style={item.bgColor}
          >
            <View className={'iconfont ' + item.icon} />
          </View>
          <View className='icon-info'>
            {item.title}
          </View>
        </View>
      )
    });

    return (
      <View className='fx-CategoryList-wrap'>
        <View className='at-row at-row--wrap'>
          {iconContent}
        </View>
      </View>
    )
  }
}

export default CategoryList
