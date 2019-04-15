import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { TabBarProps, TabBarState } from './TabBar.interface'
import './TabBar.scss'

class TabBar extends Component<TabBarProps,TabBarState > {
  constructor(props: TabBarProps) {
    super(props);
    this.state = {
      showLeftBar: false,
      bookId: this.props.nowBookId,
      bookType: this.props.nowBookType,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:TabBarProps = {
    nowBookId: '',
    nowBookType: '',
    isSpecial: false,
  };

  /**
   * 显示侧边栏
   */
  showLeftBar() {
    this.setState({
      showLeftBar: true,
    })
  }

  /**
   * 关闭组件时将状态重置
   */
  onClose() {
    this.setState({
      showLeftBar: false,
    })
  }

  /**
   * 显示记账选项
   */
  showRecordWay() {
    // 如果类型是moneyManagement跳转到相应页面
   if (this.state.bookType == 'moneyManagement') {
      Taro.navigateTo({
        url: '/pages/newManagement/newManagement?bookId=' + this.state.bookId
      })
    } else {
      Taro.navigateTo({
        url: '/pages/newTravel/newTravel?bookId=' + this.state.bookId +
          '&bookType=' + this.state.bookType +
          '&is_admin=' + true +
          '&first_create=' + true
      })
    }
  }

  /**
   * 切换账本
   */
  changeBook() {
    this.setState({
      showLeftBar: false,
    });
    Taro.redirectTo({
      url: '/pages/accountBook/accountBook'
    })
  }

  render() {
    return (
      <View className='fx-TabBar-wrap at-row at-row__justify--between'>
        <View className='at-col menu-button'>
          <View
            className='at-icon at-icon-list'
            onClick={this.showLeftBar}
          />
          <AtDrawer
            show={this.state.showLeftBar}
            mask
            onClose={this.onClose.bind(this)}
          >
            <View className='drawer-top-item' />
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.changeBook}
            >
              切换账本<View className='at-icon at-icon-bookmark' />
            </View>
            <View className='drawer-item half-border-bottom border-bottom'>
              发现<View className='at-icon at-icon-eye' />
            </View>
            <View className='drawer-item half-border-bottom border-bottom'>
              愿望记账<View className='at-icon at-icon-heart-2' />
            </View>
          </AtDrawer>
        </View>
        <View className='at-col at-row at-row__align-content--center'>
          <View
            className='at-col add-button'
            onClick={this.showRecordWay}
          >
            <View className='at-icon at-icon-close rotate-button' />
          </View>
        </View>
      </View>
    )
  }
}

export default TabBar
